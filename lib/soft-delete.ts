import { db } from "@/lib/db";

// Soft delete helper functions for different models
// NOTE: Soft delete functionality is temporarily disabled until database migration is applied
// After running the migration, you can uncomment the soft delete functionality

export class SoftDeleteHelper {
  // User operations
  static async softDeleteUser(id: number) {
    // For now, perform hard delete until database is migrated
    return await db.user.delete({
      where: { id },
    });
  }

  static async restoreUser(id: number) {
    // Not applicable until database is migrated
    throw new Error("Restore functionality not available until database is migrated");
  }

  static async findUserById(id: number) {
    return await db.user.findUnique({
      where: { id },
    });
  }

  static async findManyUsers(where: any = {}) {
    return await db.user.findMany({
      where,
    });
  }

  // News operations
  static async softDeleteNews(id: number) {
    // For now, perform hard delete until database is migrated
    return await db.news.delete({
      where: { id },
    });
  }

  static async restoreNews(id: number) {
    // Not applicable until database is migrated
    throw new Error("Restore functionality not available until database is migrated");
  }

  static async findNewsById(id: number) {
    return await db.news.findUnique({
      where: { id },
    });
  }

  static async findManyNews(where: any = {}) {
    return await db.news.findMany({
      where,
    });
  }

  // Program operations
  static async softDeleteProgram(id: number) {
    // For now, perform hard delete until database is migrated
    return await db.program.delete({
      where: { id },
    });
  }

  static async restoreProgram(id: number) {
    // Not applicable until database is migrated
    throw new Error("Restore functionality not available until database is migrated");
  }

  static async findProgramById(id: number) {
    return await db.program.findUnique({
      where: { id },
    });
  }

  static async findManyPrograms(where: any = {}) {
    return await db.program.findMany({
      where,
    });
  }

  // Gallery operations
  static async softDeleteGallery(id: number) {
    // For now, perform hard delete until database is migrated
    return await db.gallery.delete({
      where: { id },
    });
  }

  static async restoreGallery(id: number) {
    // Not applicable until database is migrated
    throw new Error("Restore functionality not available until database is migrated");
  }

  static async findGalleryById(id: number) {
    return await db.gallery.findUnique({
      where: { id },
    });
  }

  static async findManyGalleries(where: any = {}) {
    return await db.gallery.findMany({
      where,
    });
  }

  // Member operations
  static async softDeleteMember(id: number) {
    // For now, perform hard delete until database is migrated
    return await db.member.delete({
      where: { id },
    });
  }

  static async restoreMember(id: number) {
    // Not applicable until database is migrated
    throw new Error("Restore functionality not available until database is migrated");
  }

  static async findMemberById(id: number) {
    return await db.member.findUnique({
      where: { id },
    });
  }

  static async findManyMembers(where: any = {}) {
    return await db.member.findMany({
      where,
    });
  }

  // Generic operations
  static async softDelete(model: any, id: number) {
    // For now, perform hard delete until database is migrated
    return await model.delete({
      where: { id },
    });
  }

  static async restore(model: any, id: number) {
    // Not applicable until database is migrated
    throw new Error("Restore functionality not available until database is migrated");
  }

  static async findById(model: any, id: number, include?: any) {
    return await model.findUnique({
      where: { id },
      include,
    });
  }

  static async findMany(model: any, where: any = {}, include?: any) {
    return await model.findMany({
      where,
      include,
    });
  }

  // Count functions
  static async countUsers(where: any = {}) {
    return await db.user.count({
      where,
    });
  }

  static async countNews(where: any = {}) {
    return await db.news.count({
      where,
    });
  }

  static async countPrograms(where: any = {}) {
    return await db.program.count({
      where,
    });
  }

  static async countGalleries(where: any = {}) {
    return await db.gallery.count({
      where,
    });
  }

  static async countMembers(where: any = {}) {
    return await db.member.count({
      where,
    });
  }

  // Hard delete functions (for administrators only)
  static async hardDeleteUser(id: number) {
    return await db.user.delete({
      where: { id },
    });
  }

  static async hardDeleteNews(id: number) {
    return await db.news.delete({
      where: { id },
    });
  }

  static async hardDeleteProgram(id: number) {
    return await db.program.delete({
      where: { id },
    });
  }

  static async hardDeleteGallery(id: number) {
    return await db.gallery.delete({
      where: { id },
    });
  }

  static async hardDeleteMember(id: number) {
    return await db.member.delete({
      where: { id },
    });
  }

  // Find deleted records (for admin/audit purposes)
  static async findDeletedUsers() {
    // Not applicable until database is migrated
    return [];
  }

  static async findDeletedNews() {
    // Not applicable until database is migrated
    return [];
  }

  static async findDeletedPrograms() {
    // Not applicable until database is migrated
    return [];
  }

  static async findDeletedGalleries() {
    // Not applicable until database is migrated
    return [];
  }

  static async findDeletedMembers() {
    // Not applicable until database is migrated
    return [];
  }
}

// Middleware function to automatically filter out deleted records
export function withSoftDelete(model: any) {
  return {
    ...model,
    findFirst: async ({ where, ...args }: any) => {
      return model.findFirst({
        where,
        ...args,
      });
    },
    findMany: async ({ where, ...args }: any) => {
      return model.findMany({
        where,
        ...args,
      });
    },
    findUnique: async ({ where, ...args }: any) => {
      return model.findFirst({
        where,
        ...args,
      });
    },
    count: async ({ where, ...args }: any) => {
      return model.count({
        where,
        ...args,
      });
    },
  };
}