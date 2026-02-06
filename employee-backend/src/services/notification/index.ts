import { Prisma } from "@src/libs/db/prisma/generated/prisma";
import { addPushTokenAsync } from "./addPushToken";
import { prisma } from "@src/libs/db/prisma";

type AddTokenProps = {
  update: Prisma.ExpoTokenUpdateInput;
  data: Prisma.ExpoTokenCreateInput;
  where: Prisma.ExpoTokenWhereUniqueInput;
};

type GetAllProps = {
  where?: Prisma.ExpoTokenWhereInput;
};

type GetUniqueProps = {
  where: Prisma.ExpoTokenWhereUniqueInput;
};

export const NotificationServices = {
  async addToken(props: AddTokenProps) {
    return await addPushTokenAsync(props);
  },

  async getAll(props: GetAllProps = {}) {
    return prisma.expoToken.findMany(props);
  },

  async getUnique(props: GetUniqueProps) {
    return prisma.expoToken.findMany(props);
  },
};
