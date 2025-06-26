import { z } from "zod";
import { faker } from "@faker-js/faker";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import { getColumns } from "./table";

export const createRows = async (
  db: PrismaClient,
  tableId: string,
  amount: number,
  randomData: boolean,
) => {
  // generate rows
  const rowData = Array(amount).fill({ tableId });
  const rows = await db.row.createManyAndReturn({ data: rowData });

  if (!randomData) return;

  const columns = await getColumns(tableId);
  const cells = [];

  for (const row of rows) {
    for (const column of columns) {
      let value;
      switch (column.type) {
        case "Text":
          value = faker.word.noun({ length: { min: 1, max: 5 } });
          break;
        case "Number":
          value = faker.number.int({ min: 0, max: 1000 }).toString();
          break;
      }
      cells.push({
        rowId: row.id,
        columnId: column.id,
        value,
      });
    }
  }

  await db.cell.createMany({ data: cells });
};

export const rowRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
        amount: z.number().min(1),
        randomData: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({
        where: { id: input.tableId, Project: { userId: ctx.session.user.id } },
      });
      if (!table) throw new Error("Table not found");

      await createRows(ctx.db, input.tableId, input.amount, input.randomData);
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.row.delete({
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
});
