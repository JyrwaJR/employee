import { PrismaClient } from "@prisma/client/extension";
import * as bcrypt from "bcrypt";
import { $Enums } from "./generated/prisma";

const { Month, UserRole, CityClass, PaymentStatus } = $Enums;

const prisma = new PrismaClient();

// --- CONFIGURATION ---

// Historic DA Rates (Approximate for 7th CPC)
const DA_RATES: Record<number, Record<number, number>> = {
  2023: { 0: 38, 6: 42 }, // Jan: 38%, July: 42%
  2024: { 0: 46, 6: 50 }, // Jan: 46%, July: 50%
  2025: { 0: 50, 6: 53 }, // Jan: 50%, July: 53%
};

// 10 Mock Employees with starting Basic Pay (Jan 2023)
const EMPLOYEES_DATA = [
  {
    name: "Amit Sharma",
    role: "Senior Technical Officer",
    level: 11,
    startBasic: 67700,
    dept: "IT",
  },
  {
    name: "Priya Verma",
    role: "Assistant Section Officer",
    level: 7,
    startBasic: 44900,
    dept: "Admin",
  },
  {
    name: "Rahul Singh",
    role: "Scientist 'C'",
    level: 11,
    startBasic: 69700,
    dept: "Research",
  },
  {
    name: "Sneha Gupta",
    role: "Junior Secretariat Asst",
    level: 2,
    startBasic: 19900,
    dept: "Accounts",
  },
  {
    name: "Vikram Malhotra",
    role: "Director",
    level: 13,
    startBasic: 123100,
    dept: "Management",
  },
  {
    name: "Anjali Das",
    role: "MTS",
    level: 1,
    startBasic: 18000,
    dept: "Support",
  },
  {
    name: "Rohan Mehta",
    role: "Data Entry Operator",
    level: 4,
    startBasic: 25500,
    dept: "IT",
  },
  {
    name: "Kavita Reddy",
    role: "Section Officer",
    level: 8,
    startBasic: 47600,
    dept: "Admin",
  },
  {
    name: "Arjun Nair",
    role: "Technical Assistant",
    level: 6,
    startBasic: 35400,
    dept: "Lab",
  },
  {
    name: "Meera Iyer",
    role: "Private Secretary",
    level: 8,
    startBasic: 49000,
    dept: "Secretariat",
  },
];

const MONTHS_MAP = [
  Month.JANUARY,
  Month.FEBRUARY,
  Month.MARCH,
  Month.APRIL,
  Month.MAY,
  Month.JUNE,
  Month.JULY,
  Month.AUGUST,
  Month.SEPTEMBER,
  Month.OCTOBER,
  Month.NOVEMBER,
  Month.DECEMBER,
];

// --- HELPERS ---

// Simulate 3% annual increment rounded to nearest 100
function getNextCellBasic(currentBasic: number) {
  return Math.round((currentBasic * 1.03) / 100) * 100;
}

function getDaRate(year: number, monthIndex: number) {
  if (monthIndex >= 6) return DA_RATES[year][6];
  return DA_RATES[year][0];
}

async function main() {
  console.log("🌱 Starting Seeding Process...");

  // Hash password once to reuse
  const passwordHash = await bcrypt.hash("Password@123", 10);

  for (const [index, emp] of EMPLOYEES_DATA.entries()) {
    const empIdNum = 1000 + index;
    const email = `${emp.name.split(" ")[0].toLowerCase()}@nic.in`;

    console.log(`Processing: ${emp.name} (${emp.level})`);

    // 1. Create User
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: emp.name.split(" ")[0],
        lastName: emp.name.split(" ")[1],
        role: emp.level > 10 ? UserRole.ADMIN : UserRole.EMPLOYEE,
      },
    });

    // 2. Create Profile
    const profile = await prisma.employeeProfile.create({
      data: {
        userId: user.id,
        empId: `GOV-${empIdNum}`,
        designation: emp.role,
        department: emp.dept,
        officeLocation: "CGO Complex, New Delhi",
        cityClass: CityClass.X,
        payLevel: emp.level,
        payCell: 1, // Starting cell for this mock
        dateOfJoining: new Date("2015-06-15"),
        panNumber: `ABCDE${empIdNum}F`,
        pranNumber: `112233${empIdNum}`,
        bankAccountNo: `98765432${empIdNum}`,
        bankIfsc: "SBIN0001234",
      },
    });

    // 3. Generate 3 Years of Salary Slips
    let currentBasic = emp.startBasic;
    let payCell = 1;

    for (let year = 2023; year <= 2025; year++) {
      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        // --- LOGIC: Annual Increment in July ---
        if (monthIndex === 6 && year > 2022) {
          // (Skip increment for Jan 2023 start, apply in July 23, July 24, July 25)
          const oldBasic = currentBasic;
          currentBasic = getNextCellBasic(currentBasic);
          payCell++;

          // Log Revision
          await prisma.salaryRevision.create({
            data: {
              employeeId: profile.id,
              effectiveDate: new Date(year, 6, 1),
              type: "ANNUAL_INCREMENT",
              prevPayLevel: emp.level,
              prevPayCell: payCell - 1,
              prevBasic: oldBasic,
              newPayLevel: emp.level,
              newPayCell: payCell,
              newBasic: currentBasic,
              remarks: `Annual Increment July ${year}`,
            },
          });
        }

        // --- CALCULATION ---
        const daPercent = getDaRate(year, monthIndex);
        const hraPercent = 0.27; // Class X City
        const npsPercent = 0.1; // 10% of Basic + DA

        // Earnings
        const basicPay = currentBasic;
        const da = Math.round(basicPay * (daPercent / 100));
        const hra = Math.round(basicPay * hraPercent);
        const transportAllow = emp.level >= 9 ? 7200 : 3600; // Simplified TA
        const daOnTa = Math.round(transportAllow * (daPercent / 100));
        const totalEarnings = basicPay + da + hra + transportAllow + daOnTa;

        // Deductions
        const nps = Math.round((basicPay + da) * npsPercent);
        const cghs = 650; // Flat rate for mock
        const cgegis = 60;
        const profTax = 200;

        // Tax (Rough Slab Calculation)
        let incomeTax = 0;
        if (totalEarnings * 12 > 750000) incomeTax = 5000;
        else if (totalEarnings * 12 > 500000) incomeTax = 2000;

        const totalDeductions = nps + cghs + cgegis + profTax + incomeTax;
        const netPayable = totalEarnings - totalDeductions;

        // --- CREATE SLIP ---
        await prisma.salarySlip.create({
          data: {
            employeeId: profile.id,
            month: MONTHS_MAP[monthIndex],
            year: year,
            status: PaymentStatus.PAID,
            paymentDate: new Date(year, monthIndex, 28), // Paid on 28th

            basicPay,
            da,
            hra,
            transportAllow,
            daOnTa,
            totalEarnings,

            npsTier1: nps,
            cghs,
            cgegis,
            profTax,
            incomeTax,
            totalDeductions,

            netPayable,
            remarks:
              monthIndex === 6 ? "Annual Increment Processed" : undefined,
          },
        });
      }
    }

    // 4. Update Current Salary Structure (to match Dec 2025)
    await prisma.salaryStructure.create({
      data: {
        employeeId: profile.id,
        basicPay: currentBasic,
        daRate: 53.0, // Dec 2025 rate
        hraFixed: null, // Use % calculation
        transportAllow: emp.level >= 9 ? 7200 : 3600,
        cghsTierAmount: 650,
        cgegisAmount: 60,
      },
    });
  }

  console.log("✅ Seeding Complete: 10 Users, 360 Salary Slips generated.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
