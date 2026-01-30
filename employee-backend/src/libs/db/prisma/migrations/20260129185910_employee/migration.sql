-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('ACTIVE', 'PROBATION', 'SUSPENDED', 'TERMINATED', 'RESIGNED', 'RETIRED', 'DECEASED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSED', 'PAID', 'FAILED', 'HELD');

-- CreateEnum
CREATE TYPE "RevisionType" AS ENUM ('JOINING', 'ANNUAL_INCREMENT', 'MACP', 'PROMOTION', 'DA_HIKE', 'PAY_COMMISSION', 'CORRECTION');

-- CreateEnum
CREATE TYPE "Month" AS ENUM ('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER');

-- CreateEnum
CREATE TYPE "CityClass" AS ENUM ('X', 'Y', 'Z');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "employee_id" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "EmployeeProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "office_location" TEXT NOT NULL,
    "city_class" "CityClass" NOT NULL DEFAULT 'X',
    "pay_level" INTEGER NOT NULL,
    "pay_cell" INTEGER NOT NULL,
    "date_of_joining" TIMESTAMP(3) NOT NULL,
    "status" "EmploymentStatus" NOT NULL DEFAULT 'ACTIVE',
    "pan_number" TEXT,
    "pran_number" TEXT,
    "cghs_card_no" TEXT,
    "uan_number" TEXT,
    "bank_account_no" TEXT,
    "bank_ifsc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryStructure" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "basic_pay" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "da_rate" DECIMAL(5,2) NOT NULL DEFAULT 50.00,
    "hra_fixed" DECIMAL(10,2),
    "transport_allow" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "npa" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "is_nps_active" BOOLEAN NOT NULL DEFAULT true,
    "cghs_tier_amount" DECIMAL(10,2) NOT NULL DEFAULT 650,
    "cgegis_amount" DECIMAL(10,2) NOT NULL DEFAULT 60,
    "license_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "effective_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalarySlip" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "month" "Month" NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_date" TIMESTAMP(3),
    "basic_pay" DECIMAL(10,2) NOT NULL,
    "da" DECIMAL(10,2) NOT NULL,
    "hra" DECIMAL(10,2) NOT NULL,
    "transport_allow" DECIMAL(10,2) NOT NULL,
    "da_on_ta" DECIMAL(10,2) NOT NULL,
    "npa" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "sba" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "arrears" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "bonus" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_earnings" DECIMAL(10,2) NOT NULL,
    "nps_tier_1" DECIMAL(10,2) NOT NULL,
    "cghs" DECIMAL(10,2) NOT NULL,
    "cgegis" DECIMAL(10,2) NOT NULL,
    "license_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "income_tax" DECIMAL(10,2) NOT NULL,
    "prof_tax" DECIMAL(10,2) NOT NULL,
    "gpf" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "recovery" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_deductions" DECIMAL(10,2) NOT NULL,
    "net_payable" DECIMAL(10,2) NOT NULL,
    "remarks" TEXT,
    "generated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalarySlip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryRevision" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "type" "RevisionType" NOT NULL,
    "prev_pay_level" INTEGER NOT NULL,
    "prev_pay_cell" INTEGER NOT NULL,
    "prev_basic" DECIMAL(10,2) NOT NULL,
    "new_pay_level" INTEGER NOT NULL,
    "new_pay_cell" INTEGER NOT NULL,
    "new_basic" DECIMAL(10,2) NOT NULL,
    "remarks" TEXT,
    "approved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalaryRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRecord" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "days_count" INTEGER NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "is_lwp" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaveRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeProfile_userId_key" ON "EmployeeProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeProfile_employee_id_key" ON "EmployeeProfile"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "SalaryStructure_employee_id_key" ON "SalaryStructure"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "SalarySlip_employee_id_month_year_key" ON "SalarySlip"("employee_id", "month", "year");

-- AddForeignKey
ALTER TABLE "EmployeeProfile" ADD CONSTRAINT "EmployeeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryStructure" ADD CONSTRAINT "SalaryStructure_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "EmployeeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalarySlip" ADD CONSTRAINT "SalarySlip_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "EmployeeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryRevision" ADD CONSTRAINT "SalaryRevision_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "EmployeeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRecord" ADD CONSTRAINT "LeaveRecord_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "EmployeeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
