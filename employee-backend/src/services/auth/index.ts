import { prisma } from "@libs/db/prisma";
import { Prisma, $Enums } from "@libs/db/prisma/generated/prisma";
import { BcryptService } from "../../libs/auth/bcrypt";
import { UsePasswordServices } from "./usePassword";

type UniqueAuthProps = {
  where: Prisma.AuthWhereUniqueInput;
};

type AuthProps = {
  where?: Prisma.AuthWhereInput;
};

type CreateUserT = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: $Enums.Role;
};

type UpdateUnique = {
  authId: string;
  password: string;
};

export const AuthServices = {
  async updateUnique({ password, authId }: UpdateUnique) {
    const hashPassword = await BcryptService.hash(password);

    return await prisma.$transaction(async (tx) => {
      await tx.auth.update({
        where: { id: authId },
        data: {
          hash_password: hashPassword,
          isFirstTimeLogin: false,
        },
      });

      await tx.usePassword.create({
        data: {
          auth: { connect: { id: authId } },
          hash_password: hashPassword,
          is_primary: true,
        },
      });
    });
  },

  async getUnique({ where }: UniqueAuthProps) {
    return await prisma.auth.findUnique({
      where,
      include: {
        user: {
          omit: {
            auth_id: true,
          },
        },
      },
    });
  },

  async getAuths({ where }: AuthProps = { where: {} }) {
    return await prisma.auth.findMany({ where });
  },

  async create(data: CreateUserT) {
    const password = data.password;
    const hashPassword = await BcryptService.hash(password);

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role || "USER",
        },
      });

      // create auth for user
      const auth = await tx.auth.create({
        data: {
          hash_password: hashPassword,
          email: data.email,
          user: { connect: { id: user.id } },
        },
      });

      await tx.usePassword.create({
        data: {
          auth_id: auth.id,
          hash_password: hashPassword,
          is_primary: true,
        },
      });

      // connect user after auth is created
      await tx.user.update({
        where: { id: user.id },
        data: {
          auth_id: auth.id,
          auth: { connect: { id: auth.id } },
        },
      });
    });
  },
};
