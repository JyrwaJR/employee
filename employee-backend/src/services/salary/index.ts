import { prisma } from "@src/libs/db/prisma";
import { Prisma } from "@src/libs/db/prisma/generated/prisma";

type GetSalarys = {
  where?: Prisma.SalarySlipWhereInput;
};

type GetUniqueSalary = {
  where: Prisma.SalarySlipWhereUniqueInput;
};

export const SalaryService = {
  async getSalary({ where }: GetSalarys = {}) {
    return await prisma.salarySlip.findMany({ where });
  },

  async getUnique({ where }: GetUniqueSalary) {
    return await prisma.salarySlip.findUnique({
      where,
      include: { employee: true },
    });
  },
};
