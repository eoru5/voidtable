import { CellType } from "@prisma/client";
import { z } from "zod/v4";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const columnRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
        name: z.string().min(1),
        type: z.enum(CellType),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({
        where: { id: input.tableId, Project: { userId: ctx.session.user.id } },
      });
      if (!table) throw new Error("Table not found or user doesn't have perms");
      const column = await ctx.db.column.create({
        data: { tableId: input.tableId, name: input.name, type: input.type },
      });
      return column;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.column.delete({
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
        id: z.number(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.column.update({
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
        },
      });
    }),
});
