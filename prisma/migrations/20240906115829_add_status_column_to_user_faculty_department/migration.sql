-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'UN_AVAILABLE');

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "status" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "faculties" ADD COLUMN     "status" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE';
