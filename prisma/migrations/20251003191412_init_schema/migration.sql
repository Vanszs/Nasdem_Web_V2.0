-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('superadmin', 'editor', 'analyst');

-- CreateEnum
CREATE TYPE "public"."OrgLevel" AS ENUM ('dpd', 'sayap', 'dpc', 'dprt', 'kader');

-- CreateEnum
CREATE TYPE "public"."MemberStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "public"."PositionEnum" AS ENUM ('ketua', 'sekretaris', 'bendahara', 'wakil', 'anggota');

-- CreateEnum
CREATE TYPE "public"."RegionType" AS ENUM ('kabupaten', 'kecamatan', 'desa');

-- CreateEnum
CREATE TYPE "public"."GenderEnum" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "public"."ElectionType" AS ENUM ('dprd');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Party" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "abbreviation" VARCHAR(20),
    "logoUrl" VARCHAR(255),

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "subtitle" VARCHAR(255),
    "description" TEXT,
    "iconUrl" VARCHAR(255),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."News" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "publishDate" TIMESTAMP(3),
    "thumbnailUrl" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ,
    "userId" INTEGER,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Program" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "photoUrl" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ,
    "categoryId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Gallery" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(50),
    "url" VARCHAR(255) NOT NULL,
    "caption" TEXT,
    "uploadDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ,
    "userId" INTEGER,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SayapType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "SayapType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Region" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "public"."RegionType" NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StrukturOrganisasi" (
    "id" SERIAL NOT NULL,
    "level" "public"."OrgLevel" NOT NULL,
    "position" "public"."PositionEnum" NOT NULL,
    "photoUrl" VARCHAR(255),
    "sayapTypeId" INTEGER,
    "regionId" INTEGER,

    CONSTRAINT "StrukturOrganisasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Member" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(30),
    "dateOfBirth" TIMESTAMP(3),
    "address" TEXT,
    "bio" TEXT,
    "gender" "public"."GenderEnum",
    "status" "public"."MemberStatus" DEFAULT 'active',
    "photoUrl" VARCHAR(255),
    "joinDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ,
    "userId" INTEGER,
    "strukturId" INTEGER,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Caleg" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "photoUrl" VARCHAR(255),
    "partyId" INTEGER NOT NULL,

    CONSTRAINT "Caleg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Dapil" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Dapil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kecamatan" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "dapilId" INTEGER NOT NULL,

    CONSTRAINT "Kecamatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Desa" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "kecamatanId" INTEGER NOT NULL,

    CONSTRAINT "Desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tps" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(20) NOT NULL,
    "desaId" INTEGER NOT NULL,

    CONSTRAINT "Tps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DprdElectionAnalysis" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "totalValidVotes" INTEGER,
    "invalidVotes" INTEGER,
    "dpt" INTEGER,
    "dptb" INTEGER,
    "dpk" INTEGER,
    "totalVotes" INTEGER,
    "turnoutPercent" DECIMAL(5,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dapilId" INTEGER,
    "kecamatanId" INTEGER,
    "desaId" INTEGER,
    "tpsId" INTEGER,

    CONSTRAINT "DprdElectionAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DprdPartyResult" (
    "id" SERIAL NOT NULL,
    "votes" INTEGER,
    "electionAnalysisId" INTEGER NOT NULL,
    "partyId" INTEGER NOT NULL,

    CONSTRAINT "DprdPartyResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DprdCalegResult" (
    "id" SERIAL NOT NULL,
    "votes" INTEGER,
    "electionAnalysisId" INTEGER NOT NULL,
    "calegId" INTEGER NOT NULL,

    CONSTRAINT "DprdCalegResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "public"."User"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Party_name_key" ON "public"."Party"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Party_abbreviation_key" ON "public"."Party"("abbreviation");

-- CreateIndex
CREATE INDEX "Party_name_idx" ON "public"."Party"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE INDEX "News_publishDate_idx" ON "public"."News"("publishDate");

-- CreateIndex
CREATE INDEX "News_userId_idx" ON "public"."News"("userId");

-- CreateIndex
CREATE INDEX "News_deletedAt_idx" ON "public"."News"("deletedAt");

-- CreateIndex
CREATE INDEX "Program_categoryId_idx" ON "public"."Program"("categoryId");

-- CreateIndex
CREATE INDEX "Program_userId_idx" ON "public"."Program"("userId");

-- CreateIndex
CREATE INDEX "Program_startDate_idx" ON "public"."Program"("startDate");

-- CreateIndex
CREATE INDEX "Program_deletedAt_idx" ON "public"."Program"("deletedAt");

-- CreateIndex
CREATE INDEX "Gallery_userId_idx" ON "public"."Gallery"("userId");

-- CreateIndex
CREATE INDEX "Gallery_uploadDate_idx" ON "public"."Gallery"("uploadDate");

-- CreateIndex
CREATE INDEX "Gallery_deletedAt_idx" ON "public"."Gallery"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SayapType_name_key" ON "public"."SayapType"("name");

-- CreateIndex
CREATE INDEX "Region_type_idx" ON "public"."Region"("type");

-- CreateIndex
CREATE INDEX "Region_name_idx" ON "public"."Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Region_type_name_key" ON "public"."Region"("type", "name");

-- CreateIndex
CREATE INDEX "StrukturOrganisasi_level_idx" ON "public"."StrukturOrganisasi"("level");

-- CreateIndex
CREATE INDEX "StrukturOrganisasi_position_idx" ON "public"."StrukturOrganisasi"("position");

-- CreateIndex
CREATE INDEX "StrukturOrganisasi_regionId_idx" ON "public"."StrukturOrganisasi"("regionId");

-- CreateIndex
CREATE INDEX "StrukturOrganisasi_sayapTypeId_idx" ON "public"."StrukturOrganisasi"("sayapTypeId");

-- CreateIndex
CREATE INDEX "Member_status_idx" ON "public"."Member"("status");

-- CreateIndex
CREATE INDEX "Member_userId_idx" ON "public"."Member"("userId");

-- CreateIndex
CREATE INDEX "Member_strukturId_idx" ON "public"."Member"("strukturId");

-- CreateIndex
CREATE INDEX "Member_fullName_idx" ON "public"."Member"("fullName");

-- CreateIndex
CREATE INDEX "Member_deletedAt_idx" ON "public"."Member"("deletedAt");

-- CreateIndex
CREATE INDEX "Caleg_partyId_idx" ON "public"."Caleg"("partyId");

-- CreateIndex
CREATE INDEX "Caleg_fullName_idx" ON "public"."Caleg"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Caleg_partyId_fullName_key" ON "public"."Caleg"("partyId", "fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Dapil_name_key" ON "public"."Dapil"("name");

-- CreateIndex
CREATE INDEX "Kecamatan_dapilId_idx" ON "public"."Kecamatan"("dapilId");

-- CreateIndex
CREATE INDEX "Kecamatan_name_idx" ON "public"."Kecamatan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Kecamatan_dapilId_name_key" ON "public"."Kecamatan"("dapilId", "name");

-- CreateIndex
CREATE INDEX "Desa_kecamatanId_idx" ON "public"."Desa"("kecamatanId");

-- CreateIndex
CREATE INDEX "Desa_name_idx" ON "public"."Desa"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Desa_kecamatanId_name_key" ON "public"."Desa"("kecamatanId", "name");

-- CreateIndex
CREATE INDEX "Tps_desaId_idx" ON "public"."Tps"("desaId");

-- CreateIndex
CREATE INDEX "Tps_number_idx" ON "public"."Tps"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Tps_desaId_number_key" ON "public"."Tps"("desaId", "number");

-- CreateIndex
CREATE INDEX "DprdElectionAnalysis_year_idx" ON "public"."DprdElectionAnalysis"("year");

-- CreateIndex
CREATE INDEX "DprdElectionAnalysis_dapilId_idx" ON "public"."DprdElectionAnalysis"("dapilId");

-- CreateIndex
CREATE INDEX "DprdElectionAnalysis_kecamatanId_idx" ON "public"."DprdElectionAnalysis"("kecamatanId");

-- CreateIndex
CREATE INDEX "DprdElectionAnalysis_desaId_idx" ON "public"."DprdElectionAnalysis"("desaId");

-- CreateIndex
CREATE INDEX "DprdElectionAnalysis_tpsId_idx" ON "public"."DprdElectionAnalysis"("tpsId");

-- CreateIndex
CREATE UNIQUE INDEX "DprdElectionAnalysis_year_tpsId_key" ON "public"."DprdElectionAnalysis"("year", "tpsId");

-- CreateIndex
CREATE INDEX "DprdPartyResult_electionAnalysisId_idx" ON "public"."DprdPartyResult"("electionAnalysisId");

-- CreateIndex
CREATE INDEX "DprdPartyResult_partyId_idx" ON "public"."DprdPartyResult"("partyId");

-- CreateIndex
CREATE UNIQUE INDEX "DprdPartyResult_electionAnalysisId_partyId_key" ON "public"."DprdPartyResult"("electionAnalysisId", "partyId");

-- CreateIndex
CREATE INDEX "DprdCalegResult_electionAnalysisId_idx" ON "public"."DprdCalegResult"("electionAnalysisId");

-- CreateIndex
CREATE INDEX "DprdCalegResult_calegId_idx" ON "public"."DprdCalegResult"("calegId");

-- CreateIndex
CREATE UNIQUE INDEX "DprdCalegResult_electionAnalysisId_calegId_key" ON "public"."DprdCalegResult"("electionAnalysisId", "calegId");

-- AddForeignKey
ALTER TABLE "public"."News" ADD CONSTRAINT "News_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Program" ADD CONSTRAINT "Program_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Program" ADD CONSTRAINT "Program_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Gallery" ADD CONSTRAINT "Gallery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StrukturOrganisasi" ADD CONSTRAINT "StrukturOrganisasi_sayapTypeId_fkey" FOREIGN KEY ("sayapTypeId") REFERENCES "public"."SayapType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StrukturOrganisasi" ADD CONSTRAINT "StrukturOrganisasi_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_strukturId_fkey" FOREIGN KEY ("strukturId") REFERENCES "public"."StrukturOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Caleg" ADD CONSTRAINT "Caleg_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "public"."Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Kecamatan" ADD CONSTRAINT "Kecamatan_dapilId_fkey" FOREIGN KEY ("dapilId") REFERENCES "public"."Dapil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Desa" ADD CONSTRAINT "Desa_kecamatanId_fkey" FOREIGN KEY ("kecamatanId") REFERENCES "public"."Kecamatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tps" ADD CONSTRAINT "Tps_desaId_fkey" FOREIGN KEY ("desaId") REFERENCES "public"."Desa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DprdElectionAnalysis" ADD CONSTRAINT "DprdElectionAnalysis_dapilId_fkey" FOREIGN KEY ("dapilId") REFERENCES "public"."Dapil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DprdElectionAnalysis" ADD CONSTRAINT "DprdElectionAnalysis_kecamatanId_fkey" FOREIGN KEY ("kecamatanId") REFERENCES "public"."Kecamatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DprdElectionAnalysis" ADD CONSTRAINT "DprdElectionAnalysis_desaId_fkey" FOREIGN KEY ("desaId") REFERENCES "public"."Desa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DprdElectionAnalysis" ADD CONSTRAINT "DprdElectionAnalysis_tpsId_fkey" FOREIGN KEY ("tpsId") REFERENCES "public"."Tps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DprdPartyResult" ADD CONSTRAINT "DprdPartyResult_electionAnalysisId_fkey" FOREIGN KEY ("electionAnalysisId") REFERENCES "public"."DprdElectionAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DprdPartyResult" ADD CONSTRAINT "DprdPartyResult_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "public"."Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DprdCalegResult" ADD CONSTRAINT "DprdCalegResult_electionAnalysisId_fkey" FOREIGN KEY ("electionAnalysisId") REFERENCES "public"."DprdElectionAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DprdCalegResult" ADD CONSTRAINT "DprdCalegResult_calegId_fkey" FOREIGN KEY ("calegId") REFERENCES "public"."Caleg"("id") ON DELETE CASCADE ON UPDATE CASCADE;
