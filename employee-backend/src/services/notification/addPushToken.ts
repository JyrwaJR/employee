import { prisma } from "@src/libs/db/prisma";
import { Prisma } from "@src/libs/db/prisma/generated/prisma";

type Props = {
  update: Prisma.ExpoTokenUpdateInput;
  data: Prisma.ExpoTokenCreateInput;
  where: Prisma.ExpoTokenWhereUniqueInput;
};

export async function addPushTokenAsync({ data, update, where }: Props) {
  return await prisma.expoToken.upsert({
    where: where,
    update: update,
    create: data,
  });
}
