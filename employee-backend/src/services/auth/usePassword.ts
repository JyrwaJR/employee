import { prisma } from "@src/libs/db/prisma";
import { Prisma } from "@src/libs/db/prisma/generated/prisma";

type GetUnique = {
  where: Prisma.UsePasswordWhereUniqueInput;
};

type Create = {
  data: Prisma.UsePasswordCreateInput;
};

type FindFirst = {
  where?: Prisma.UsePasswordWhereInput;
};

export const UsePasswordServices = {
  async add(props: Create) {
    return await prisma.usePassword.create({ data: props.data });
  },
  async findMany(props: FindFirst = {}) {
    return await prisma.usePassword.findMany(props);
  },
  async getUnique({ where }: GetUnique) {
    return await prisma.usePassword.findUnique({ where });
  },
};
