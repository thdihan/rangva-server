-- AlterTable
ALTER TABLE "public"."gallery" ADD COLUMN     "localPath" TEXT,
ADD COLUMN     "storageType" TEXT NOT NULL DEFAULT 'local';
