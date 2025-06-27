import type { PrismaClient } from "@prisma/client";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import { z } from "zod/v4";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const createView = async (
  db: PrismaClient,
  tableId: string,
  name: string,
) => {
  return await db.view.create({
    data: {
      tableId,
      name,
    },
  });
};

export const viewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const view = await createView(ctx.db, input.tableId, input.name);
      return view;
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const view = await ctx.db.view.findUnique({
        where: {
          id: input.id,
          Table: {
            Project: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
      if (!view) {
        throw new Error("View not found");
      }
      return view;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.view.delete({
        where: {
          id: input.id,
          Table: {
            Project: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
    }),

  rename: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const view = await ctx.db.view.update({
        where: {
          id: input.id,
          Table: {
            Project: {
              userId: ctx.session.user.id,
            },
          },
        },
        data: {
          name: input.name,
          modified: new Date(),
        },
      });
      return view;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        sorts: z.array(z.json()).optional(),
        filters: z.array(z.json()).optional(),
        hiddenColumns: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const view = await ctx.db.view.findFirst({
        where: {
          id: input.id,
          Table: {
            Project: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
      if (!view) throw new Error("View not found");

      await ctx.db.view.update({
        where: { id: view.id },
        data: {
          sorts: input.sorts as InputJsonValue[],
          filters: input.filters as InputJsonValue[],
          hiddenColumns: input.hiddenColumns,
        },
      });

      return { success: true };
    }),
});
