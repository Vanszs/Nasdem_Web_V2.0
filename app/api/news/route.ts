import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getUserIfAuthenticated,
  requireAuth,
  requireRole,
} from "@/lib/jwt-middleware";
import {
  newsSchemas,
  extractQueryParams,
  validateRequest,
} from "@/lib/validation";
import { UserRole } from "@/lib/rbac";

// list semua berita
export async function GET(req: NextRequest) {
  try {
    // Extract and validate query parameters
    const query = extractQueryParams(
      newsSchemas.list,
      req.nextUrl.searchParams
    );

    const now = new Date();
    const where: any = {};

    // Determine user role if authenticated
    const user = getUserIfAuthenticated(req);
    const isPrivileged =
      user && [UserRole.EDITOR, UserRole.SUPERADMIN].includes(user.role);

    if (isPrivileged) {
      if (query.status === "archived") {
        where.deletedAt = { not: null };
      } else {
        where.deletedAt = null;
      }
    } else {
      // Public: never show archived (soft-deleted)
      where.deletedAt = null;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (isPrivileged) {
      if (query.status === "draft") {
        where.publishDate = null;
      } else {
        const publishDateFilter: any = {};

        if (query.status === "scheduled") {
          publishDateFilter.gt = now;
        }

        if (query.status === "published") {
          publishDateFilter.lte = now;
        }

        if (query.startDate) {
          publishDateFilter.gte = new Date(query.startDate);
        }

        if (query.endDate) {
          publishDateFilter.lte = new Date(query.endDate);
        }

        if (Object.keys(publishDateFilter).length) {
          where.publishDate = publishDateFilter;
        }
      }
    } else {
      // Public: only published items up to now; ignore draft/scheduled requests
      where.publishDate = { lte: now };
    }

    const [total, newsList] = await Promise.all([
      db.news.count({ where }),
      db.news.findMany({
        where,
        include: {
          user: { select: { id: true, username: true, email: true } },
        },
        orderBy: { publishDate: "desc" },
        take: query.pageSize!,
        skip: (query.page! - 1) * query.pageSize!,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: newsList,
      meta: {
        page: query.page!,
        pageSize: query.pageSize!,
        total,
        totalPages: Math.ceil(total / (query.pageSize || 20)),
      },
    });
  } catch (err: any) {
    console.error("Error fetching news:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// create berita baru
export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const body = await req.json();

    // Validate input
    const validation = validateRequest(newsSchemas.create, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
          details: validation.details,
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const userId = (req as any).user.userId;

    const news = await db.news.create({
      data: {
        title: data.title,
        content: data.content,
        publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
        thumbnailUrl: data.thumbnailUrl,
        userId,
      },
      include: { user: { select: { id: true, username: true, email: true } } },
    });

    return NextResponse.json({ success: true, data: news });
  } catch (err: any) {
    console.error("Error creating news:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create news" },
      { status: 500 }
    );
  }
}
