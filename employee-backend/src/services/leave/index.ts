import { prisma } from "@src/libs/db/prisma";
import { Prisma } from "@src/libs/db/prisma/generated/prisma";

type LeaveT = {
  where: Prisma.LeaveRecordWhereUniqueInput;
};

type LeavesT = {
  where: Prisma.LeaveRecordWhereInput;
};

export const LeaveService = {
  async getUnique({ where }: LeaveT) {
    return await prisma.leaveRecord.findUnique({ where });
  },

  async getAll({ where }: LeavesT) {
    return await prisma.leaveRecord.findMany({ where });
  },
};
