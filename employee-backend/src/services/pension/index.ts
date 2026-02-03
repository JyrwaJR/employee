import { prisma } from "@src/libs/db/prisma";
import { Prisma } from "@src/libs/db/prisma/generated/prisma";

type PensionT = {
  where: Prisma.PensionProfileWhereUniqueInput;
};

type PensionsT = {
  where: Prisma.PensionProfileWhereInput;
};

export const PensionService = {
  async getUnique({ where }: PensionT) {
    return await prisma.pensionProfile.findUnique({
      where,
      include: {
        employee: true,
        contributions: true,
      },
    });
  },

  async getAll({ where }: PensionsT) {
    return await prisma.pensionProfile.findMany({
      where,
      include: {
        employee: true,
        contributions: true,
      },
    });
  },
};
