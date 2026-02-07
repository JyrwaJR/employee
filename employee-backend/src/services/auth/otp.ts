import { prisma } from "@src/libs/db/prisma";
import { Prisma } from "@src/libs/db/prisma/generated/prisma";

type Create = {
  data: Prisma.otpCreateInput;
};

type FindUnique = {
  where: Prisma.otpWhereUniqueInput;
};

type FindFirst = {
  where: Prisma.otpWhereInput;
};

type Update = {
  data: Prisma.otpUpdateInput;
  where: Prisma.otpWhereUniqueInput;
};

export const OtpServices = {
  async create(props: Create) {
    await prisma.otp.updateMany({
      where: { is_revoked: false },
      data: { is_revoked: true },
    });
    return await prisma.otp.create(props);
  },
  async findUnique(props: FindUnique) {
    return await prisma.otp.findUnique(props);
  },
  async findFirst(props: FindFirst) {
    return await prisma.otp.findFirst(props);
  },
  async update(props: Update) {
    return await prisma.otp.update(props);
  },
};
