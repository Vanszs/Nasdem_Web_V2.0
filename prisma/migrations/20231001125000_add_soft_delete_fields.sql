-- Add soft delete fields to all relevant tables
-- This migration adds deletedAt columns to support soft delete functionality

-- Add deletedAt to User table
ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP(3) NULL;

-- Add deletedAt to News table
ALTER TABLE "News" ADD COLUMN "deletedAt" TIMESTAMP(3) NULL;

-- Add deletedAt to Program table
ALTER TABLE "Program" ADD COLUMN "deletedAt" TIMESTAMP(3) NULL;

-- Add deletedAt to Gallery table
ALTER TABLE "Gallery" ADD COLUMN "deletedAt" TIMESTAMP(3) NULL;

-- Add deletedAt to Member table
ALTER TABLE "Member" ADD COLUMN "deletedAt" TIMESTAMP(3) NULL;

-- Create indexes for deletedAt columns to improve query performance
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
CREATE INDEX "News_deletedAt_idx" ON "News"("deletedAt");
CREATE INDEX "Program_deletedAt_idx" ON "Program"("deletedAt");
CREATE INDEX "Gallery_deletedAt_idx" ON "Gallery"("deletedAt");
CREATE INDEX "Member_deletedAt_idx" ON "Member"("deletedAt");