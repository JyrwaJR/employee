import { prisma } from "@src/libs/db/prisma";
import { calculateTokenExpiry } from "@src/utils/helper/calculateTokenExpire";
import { env } from "@src/env";
import { Prisma } from "@src/libs/db/prisma/generated/prisma";

type CreateProps = {
  hash: string;
  user_id: string;
  auth_id: string;
};

type UpdateProps = {
  where: Prisma.TokenWhereUniqueInput;
  data: Prisma.TokenUpdateInput;
};

type UpdateManyProps = {
  where: Prisma.TokenWhereInput;
  data: Prisma.TokenUpdateInput;
};

export const TokenServices = {
  async updateUnique({ where, data }: UpdateProps) {
    return await prisma.token.update({ where, data });
  },

  async updateMany({ where, data }: UpdateManyProps) {
    return await prisma.token.updateMany({ where, data });
  },

  async getUnique({ where }: { where: Prisma.TokenWhereUniqueInput }) {
    return await prisma.token.findUnique({ where });
  },

  async createToken({ hash, user_id, auth_id }: CreateProps) {
    return await prisma.$transaction(async (tx) => {
      // Revoke all active tokens for user
      await tx.token.updateMany({
        where: { user_id, is_revoked: false },
        data: { is_revoked: true },
      });

      // Create new token
      await tx.token.create({
        data: {
          hash,
          expires_at: calculateTokenExpiry(env.REFRESH_TOKEN_TTL, "seconds"),
          user_id,
          auth_id,
        },
      });
    });
  },
};
