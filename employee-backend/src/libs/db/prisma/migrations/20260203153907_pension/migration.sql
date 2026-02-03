-- CreateEnum
CREATE TYPE "PensionScheme" AS ENUM ('OPS', 'NPS', 'UPS');

-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "isFirstTimeLogin" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "PensionProfile" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "scheme_type" "PensionScheme" NOT NULL DEFAULT 'NPS',
    "pran_number" TEXT,
    "ppo_number" TEXT,
    "tier_1_active" BOOLEAN NOT NULL DEFAULT true,
    "tier_2_active" BOOLEAN NOT NULL DEFAULT false,
    "employee_rate" DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    "employer_rate" DECIMAL(5,2) NOT NULL DEFAULT 14.00,
    "gpf_number" TEXT,
    "gpf_subscription" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PensionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PensionContribution" (
    "id" TEXT NOT NULL,
    "pension_profile_id" TEXT NOT NULL,
    "month" "Month" NOT NULL,
    "year" INTEGER NOT NULL,
    "employee_share" DECIMAL(10,2) NOT NULL,
    "employer_share" DECIMAL(10,2) NOT NULL,
    "total_deposited" DECIMAL(10,2) NOT NULL,
    "salary_slip_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PensionContribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PensionProfile_employee_id_key" ON "PensionProfile"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "PensionProfile_pran_number_key" ON "PensionProfile"("pran_number");

-- CreateIndex
CREATE UNIQUE INDEX "PensionProfile_ppo_number_key" ON "PensionProfile"("ppo_number");

-- CreateIndex
CREATE UNIQUE INDEX "PensionProfile_gpf_number_key" ON "PensionProfile"("gpf_number");

-- CreateIndex
CREATE UNIQUE INDEX "PensionContribution_salary_slip_id_key" ON "PensionContribution"("salary_slip_id");

-- CreateIndex
CREATE UNIQUE INDEX "PensionContribution_pension_profile_id_month_year_key" ON "PensionContribution"("pension_profile_id", "month", "year");

-- AddForeignKey
ALTER TABLE "PensionProfile" ADD CONSTRAINT "PensionProfile_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "EmployeeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PensionContribution" ADD CONSTRAINT "PensionContribution_pension_profile_id_fkey" FOREIGN KEY ("pension_profile_id") REFERENCES "PensionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
