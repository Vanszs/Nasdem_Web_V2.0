import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [heroBanners, about, activities] = await Promise.all([
      db.cmsHeroBanner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        select: { id: true, imageUrl: true, order: true },
      }),
      db.cmsAbout.findFirst({
        select: { vision: true, mission: true, videoUrl: true },
      }),
      (db as any).activity.findMany({
        orderBy: { createdAt: "desc" },
        take: 12,
        include: {
          media: { orderBy: [{ order: "asc" }, { uploadedAt: "asc" }] },
        },
      }),
    ]);

    const programs = [
      {
        id: 1,
        name: "PENDIDIKAN",
        category: "Pendidikan",
        status: "static",
        photoUrl: "/images/programs/education.jpg",
        description:
          "Program PENDIDIKAN berfokus pada peningkatan kualitas sumber daya manusia di Kabupaten Sidoarjo melalui kegiatan pelatihan, beasiswa, dan pendampingan sekolah.",
      },
      {
        id: 2,
        name: "EKONOMI",
        category: "Ekonomi",
        status: "static",
        photoUrl: "/images/programs/economy.jpg",
        description:
          "Program EKONOMI bertujuan memperkuat ketahanan ekonomi masyarakat melalui dukungan terhadap UMKM, pengembangan koperasi, serta pelatihan kewirausahaan.",
      },
      {
        id: 3,
        name: "SOSIAL",
        category: "Sosial",
        status: "static",
        photoUrl: "/images/programs/social.jpg",
        description:
          "Program SOSIAL merupakan wujud nyata dari semangat gotong royong dan kepedulian terhadap sesama.",
      },
      {
        id: 4,
        name: "KESEHATAN",
        category: "Kesehatan",
        status: "static",
        photoUrl: "/images/programs/health.jpg",
        description:
          "Program KESEHATAN berorientasi pada peningkatan kualitas hidup masyarakat melalui edukasi pola hidup sehat, kampanye kebersihan lingkungan, dan pemeriksaan kesehatan gratis.",
      },
    ];

    return NextResponse.json({
      success: true,
      data: { heroBanners, about, programs, activities },
    });
  } catch (error: any) {
    console.error("/api/landing-data error", error);
    return NextResponse.json(
      { success: false, error: "Failed to load landing data" },
      { status: 500 }
    );
  }
}
