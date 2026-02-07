import { PrismaClient, $Enums } from "./generated/prisma/index.js";

const commonPasswordHash =
  "$2b$14$C5yTy7c1.2VLv3e/k05H0.pePjam6W82wF3FmhovZLnk4eO.bBw4q";
const prisma = new PrismaClient();

async function main() {
  console.log("--- Seeding: 3 Years | 12 Months/Year | Pension | Leaves ---");

  const depts = ["MeitY", "NIC", "Finance", "Health", "Defense"];
  const cities = ["X", "Y", "Z"] as const;
  const months = Object.values($Enums.Month);

  // 1. Upsert Super Admin
  const adminAuth = await prisma.auth.upsert({
    where: { email: "admin@gov.in" },
    update: {},
    create: {
      email: "admin@gov.in",
      phone_no: "8787572702",
      hash_password: commonPasswordHash,
      user: {
        create: {
          first_name: "System",
          last_name: "Admin",
          role: "SUPER_ADMIN",
          employee: {
            create: {
              employee_id: "ADM-001",
              designation: "Chief Administrator",
              department: "HQ",
              office_location: "New Delhi",
              city_class: "X",
              pay_level: 14,
              pay_cell: 15,
              date_of_joining: new Date("2010-01-01"),
              status: "ACTIVE",
            },
          },
        },
      },
    },
    include: { user: { include: { employee: true } } },
  });

  const seededUsers = [adminAuth.user];

  // 2. Create 10 Users (Mix of Active and Retired)
  for (let i = 0; i < 10; i++) {
    const isRetired = i < 2; // First 2 are retired
    const level = (i % 12) + 1;

    const u = await prisma.user.create({
      data: {
        first_name: isRetired ? "Retired" : "Active",
        last_name: `Officer ${i + 1}`,
        role: "USER",
        auth: {
          create: {
            email: `user${i + 1}@gov.in`,
            hash_password: commonPasswordHash,
            phone_no: `1234567890${i + 1}`,
          },
        },
        employee: {
          create: {
            employee_id: `GOV-202${i % 5}-${2000 + i}`,
            designation: `Officer Grade ${level}`,
            department: depts[i % depts.length],
            office_location: "New Delhi",
            city_class: "X",
            pay_level: level,
            pay_cell: 5,
            date_of_joining: new Date("2015-06-01"),
            status: isRetired ? "RETIRED" : "ACTIVE",
          },
        },
      },
      include: { employee: true },
    });

    seededUsers.push(u);
  }

  // 3. Process All (12 months x 3 years)
  for (const user of seededUsers) {
    const emp = user.employee!;

    await prisma.user.update({
      where: { id: emp.userId },
      data: { employee_id: emp.id },
    });

    // --- PENSION PROFILE ---
    await prisma.pensionProfile.create({
      data: {
        employee_id: emp.id,
        scheme_type: emp.pay_level > 10 ? "OPS" : "NPS",
        pran_number: `PRAN-${emp.employee_id}`,
        ppo_number: emp.status === "RETIRED" ? `PPO-${emp.employee_id}` : null,
      },
    });

    // --- LEAVE RECORDS (Sample set) ---
    await prisma.leaveRecord.createMany({
      data: [
        {
          employee_id: emp.id,
          type: "EL",
          start_date: new Date("2024-05-01"),
          end_date: new Date("2024-05-10"),
          days_count: 10,
          status: "APPROVED",
          reason: "Annual Leave",
        },
        {
          employee_id: emp.id,
          type: "CL",
          start_date: new Date("2025-02-15"),
          end_date: new Date("2025-02-16"),
          days_count: 1,
          status: "PENDING",
          reason: "Personal work",
        },
      ],
    });

    // --- PAYROLL (36 Months) ---
    let runningBasic = 30000 + emp.pay_level * 5000;
    let currentDA = 38; // 2023 Start DA

    for (let year = 2023; year <= 2025; year++) {
      for (let mIdx = 0; mIdx < months.length; mIdx++) {
        const month = months[mIdx];

        // Govt Logic: DA increases in Jan and July
        if (month === "JANUARY" || month === "JULY") currentDA += 4;
        // Annual increment in July
        if (month === "JULY")
          runningBasic = Math.round((runningBasic * 1.03) / 100) * 100;

        const da = Math.round(runningBasic * (currentDA / 100));
        const hra = Math.round(runningBasic * 0.27); // X City HRA
        const ta = 3600;
        const da_on_ta = Math.round(ta * (currentDA / 100));
        const total_earnings = runningBasic + da + hra + ta + da_on_ta;

        const nps =
          emp.pay_level > 10 ? 0 : Math.round((runningBasic + da) * 0.14); // OPS users (lvl > 10) don't pay NPS
        const total_deductions = nps + 2000 + 650 + 60 + 208; // Tax + CGHS + CGEGIS + PT

        await prisma.salarySlip.create({
          data: {
            employee_id: emp.id,
            month,
            year,
            status: "PAID",
            basic_pay: runningBasic,
            da,
            hra,
            transport_allow: ta,
            da_on_ta,
            total_earnings,
            nps_tier_1: nps,
            income_tax: 2000,
            prof_tax: 208,
            cghs: 650,
            cgegis: 60,
            total_deductions,
            net_payable: total_earnings - total_deductions,
            payment_date: new Date(year, mIdx, 28),
          },
        });
      }
    }
  }

  console.log(
    "--- Seed Completed: Admin, Retired, and Active data loaded. ---",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
