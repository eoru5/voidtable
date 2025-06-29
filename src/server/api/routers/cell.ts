import type { CellType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const validateCell = (value: string, type: CellType) => {
  switch (type) {
    case "Text":
      return true;
    case "Number":
      return !isNaN(parseFloat(value)) && isFinite(Number(value));
  }
};

export const cellRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        columnId: z.number(),
        rowId: z.number(),
        value: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cell = await ctx.db.cell.findFirst({
        where: {
          columnId: input.columnId,
          rowId: input.rowId,
        },
      });
      const column = await ctx.db.column.findFirst({
        where: {
          id: input.columnId,
          Table: {
            Project: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
      if (!column) throw new Error("Column not found");

      if (input.value) {
        if (!validateCell(input.value, column.type)) {
          throw new Error("Mismatching value types");
        }

        if (cell) {
          // cell exists and nonempty input => update cell
          return await ctx.db.cell.update({
            where: { id: cell.id },
            data: { value: input.value },
          });
        } else {
          // cell doesnt exist and nonempty input => create cell
          return await ctx.db.cell.create({
            data: {
              columnId: input.columnId,
              rowId: input.rowId,
              value: input.value,
            },
          });
        }
      } else {
        if (cell) {
          // cell exists and null input => delete cell
          return await ctx.db.cell.delete({
            where: {
              id: cell.id,
            },
          });
        } else {
          throw new Error("An error occured");
        }
      }
    }),
});
