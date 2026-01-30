import { prisma } from "@src/libs/db/prisma";
import { Prisma } from "@src/libs/db/prisma/generated/prisma";

type GetEmployees = {
  where?: Prisma.EmployeeProfileWhereInput;
  include?: Prisma.EmployeeProfileInclude;
};

type GetEmployee = {
  where: Prisma.EmployeeProfileWhereUniqueInput;
  include?: Prisma.EmployeeProfileInclude;
};

export const EmployeeService = {
  async getEmployee({ where, include }: GetEmployees = {}) {
    return await prisma.employeeProfile.findMany({ where, include });
  },

  async getUnique({ where, include }: GetEmployee) {
    return await prisma.employeeProfile.findUnique({ where, include });
  },
};
