import { PrismaClient, $Enums } from "./generated/prisma/index.js";

const commonPasswordHash =
  "$2b$14$C5yTy7c1.2VLv3e/k05H0.pePjam6W82wF3FmhovZLnk4eO.bBw4q";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "--- Seeding Started: 40 Employees with Precision 10-Year Logic ---",
  );

  // 1. Create Super Admin
  await prisma.auth.upsert({
    where: { email: "admin@gov.in" },
    update: {},
    create: {
      email: "admin@gov.in",
      hash_password: commonPasswordHash,
      user: {
        create: {
          first_name: "System",
          last_name: "Admin",
          role: "SUPER_ADMIN",
        },
      },
    },
  });

  const depts = [
    "MeitY",
    "NIC",
    "Digital India",
    "Finance",
    "MyGov",
    "Health",
    "Defense",
    "Education",
  ];
  const cities = ["X", "Y", "Z"] as const;
  const firstNames = [
    "Amit",
    "Sita",
    "Rajesh",
    "Neha",
    "Vikram",
    "Priya",
    "Arjun",
    "Kiran",
    "Farah",
    "Deepak",
    "Anita",
    "Rohan",
    "Sunita",
    "Kabir",
    "Ishaan",
    "Anjali",
    "Manoj",
    "Zoya",
    "Harsh",
    "Preeti",
  ];
  const lastNames = [
    "Sharma",
    "Verma",
    "Kumar",
    "Singh",
    "Patel",
    "Iyer",
    "Reddy",
    "Das",
    "Khan",
    "Joshi",
    "Roy",
    "Mehta",
    "Bose",
    "Azad",
    "Malhotra",
    "Nair",
    "Tiwari",
    "Farooqui",
    "Vardhan",
    "Chauhan",
  ];

  for (let i = 0; i < 40; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@gov.in`;
    const level = (i % 14) + 1;
    const initialCell = (i % 5) + 1; // Start at a lower cell to allow 10 years of growth
    const city = cities[i % cities.length];

    // Starting basic in 2016 based on Level (using actual 7th CPC entry pay scales)
    const entryPay = [
      18000, 19900, 21700, 25500, 29200, 35400, 44900, 47600, 53100, 56100,
      67700, 78800, 123100, 144200,
    ];
    let runningBasic = entryPay[level - 1] || 18000;

    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        role: "USER",
        auth: { create: { email, hash_password: commonPasswordHash } },
        employee: {
          create: {
            employee_id: `GOV-${2016 + (i % 5)}-${String(i + 1).padStart(4, "0")}`,
            designation: `Officer Grade ${level}`,
            department: depts[i % depts.length],
            office_location:
              city === "X"
                ? "New Delhi"
                : city === "Y"
                  ? "Chandigarh"
                  : "Shimla",
            city_class: city as $Enums.CityClass,
            pay_level: level,
            pay_cell: initialCell + 9, // Current cell in 2025
            date_of_joining: new Date("2015-01-01"),
            status: "ACTIVE",
          },
        },
      },
      include: { employee: true },
    });

    const empId = user.employee!.id;
    let currentDA = 0;

    for (let year = 2016; year <= 2025; year++) {
      for (const month of Object.values($Enums.Month)) {
        // 1. DA Hike (Semi-Annual Logic)
        if (month === "JANUARY" || month === "JULY") currentDA += 3.5; // Avg 7% yearly hike

        // 2. Annual Increment (Every July)
        if (month === "JULY") {
          const oldBasic = runningBasic;
          runningBasic = Math.round((runningBasic * 1.03) / 100) * 100; // Standard 3% Increment
          await prisma.salaryRevision.create({
            data: {
              employee_id: empId,
              effective_date: new Date(year, 6, 1),
              type: "ANNUAL_INCREMENT",
              prev_pay_level: level,
              prev_pay_cell: initialCell + (year - 2016),
              prev_basic: oldBasic,
              new_pay_level: level,
              new_pay_cell: initialCell + (year - 2016) + 1,
              new_basic: runningBasic,
            },
          });
        }

        // 3. HRA Logic (Dynamic based on DA milestones)
        let hraPercent = city === "X" ? 0.24 : city === "Y" ? 0.16 : 0.08;
        if (currentDA >= 50) {
          hraPercent = city === "X" ? 0.3 : city === "Y" ? 0.2 : 0.1;
        } else if (currentDA >= 25) {
          hraPercent = city === "X" ? 0.27 : city === "Y" ? 0.18 : 0.09;
        }

        // 4. Calculations
        const basic = runningBasic;
        const da = Math.round(basic * (currentDA / 100));
        const hra = Math.round(basic * hraPercent);
        const sda = Math.round(basic * 0.1); // Special Duty Allowance as per CSV
        const taBase = level >= 9 ? 7200 : 3600;
        const daOnTa = Math.round(taBase * (currentDA / 100));

        const earnings = basic + da + hra + sda + taBase + daOnTa;

        // 5. Deductions
        const nps = Math.round((basic + da) * (year < 2019 ? 0.1 : 0.14)); // 14% after 2019
        const itax = basic > 100000 ? 15000 : basic > 50000 ? 5000 : 0;
        const profTax = 208; // Standard PT from CSV
        const totalDeductions = nps + itax + profTax + 650 + 60;

        await prisma.salarySlip.create({
          data: {
            employee_id: empId,
            month,
            year,
            status: "PAID",
            payment_date: new Date(
              year,
              Object.values($Enums.Month).indexOf(month),
              28,
            ),
            basic_pay: basic,
            da,
            hra,
            transport_allow: taBase,
            da_on_ta: daOnTa,
            sba: sda, // Storing SDA here
            total_earnings: earnings,
            nps_tier_1: nps,
            income_tax: itax,
            prof_tax: profTax,
            cghs: 650,
            cgegis: 60,
            total_deductions: totalDeductions,
            net_payable: earnings - totalDeductions,
            remarks: `7th CPC Cycle - ${year}`,
          },
        });
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
