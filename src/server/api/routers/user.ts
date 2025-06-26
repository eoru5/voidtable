import bcrypt from "bcryptjs";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type PrismaClient } from "@prisma/client";

export const createUser = async (
  email: string,
  password: string,
  db: PrismaClient,
) => {
  const existingUser = await db.user.findFirst({
    where: {
      email,
    },
  });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const user = await db.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
    },
  });

  await db.account.create({
    data: {
      userId: user.id,
      type: "credentials",
      provider: "credentials",
      providerAccountId: user.id,
    },
  });

  return user;
};

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        email: z
          .string({ required_error: "Email is required" })
          .min(1, "Email is required")
          .email("Invalid email"),
        password: z
          .string({ required_error: "Password is required" })
          .min(1, "Password is required")
          .min(8, "Password must be more than 8 characters")
          .max(32, "Password must be less than 32 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await createUser(input.email, input.password, ctx.db);
      return user;
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),
});
