import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type PrismaClient } from "@prisma/client";
import { createView } from "./view";
import { db } from "~/server/db";
import type { Filter, Sort } from "~/types/types";
import { createRows } from "./row";

export const getColumns = async (tableId: string) => {
  return db.column.findMany({
    orderBy: { id: "asc" },
    where: { tableId },
  });
};

export const createTable = async (
  db: PrismaClient,
  projectId: string,
  name: string,
  randomData = true,
  rows = 3,
) => {
  const table = await db.table.create({
    data: {
      projectId,
      name: name,
    },
  });
  await createView(db, table.id, "Grid View");

  await db.column.createManyAndReturn({
    data: [
      { tableId: table.id, name: "Text Column 1", type: "Text" },
      { tableId: table.id, name: "Text Column 2", type: "Text" },
      { tableId: table.id, name: "Number Column 1", type: "Number" },
      { tableId: table.id, name: "Number Column 2", type: "Number" },
    ],
  });

  await createRows(db, table.id, rows, randomData);
  return table;
};

export const tableRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1),
        randomData: z.boolean().default(true),
        rows: z.number().default(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await createTable(
        ctx.db,
        input.projectId,
        input.name,
        input.randomData,
        input.rows,
      );
    }),

  rename: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.table.update({
        where: {
          id: input.id,
          Project: {
            userId: ctx.session.user.id,
          },
        },
        data: {
          name: input.name,
          modified: new Date(),
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.table.delete({
        where: {
          id: input.id,
          Project: {
            userId: ctx.session.user.id,
          },
        },
      });
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({
        where: {
          id: input.id,
          Project: {
            userId: ctx.session.user.id,
          },
        },
        include: {
          View: {
            orderBy: { modified: "desc" },
          },
        },
      });
      if (!table) {
        throw new Error("Table not found");
      }
      return table;
    }),

  getCells: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
        viewId: z.string(),
        limit: z.number().min(1).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const view = await ctx.db.view.findUnique({
        where: {
          id: input.viewId,
          Table: { Project: { userId: ctx.session.user.id } },
        },
      });
      if (!view) throw new Error("View not found");

      const hiddenColumns = view.hiddenColumns;
      const columns = await ctx.db.column.findMany({
        where: {
          tableId: input.tableId,
          id: {
            notIn: hiddenColumns.length > 0 ? hiddenColumns : undefined,
          },
        },
      });

      let sorts = view.sorts as Sort[];
      let filters = view.filters as Filter[];

      sorts = sorts.filter((s) => columns.some((c) => c.id === s.columnId));
      filters = filters.filter(
        (f) => f.value && columns.some((c) => c.id === f.columnId),
      );

      const filterConditions = filters.map((f) => {
        switch (f.type) {
          case "is":
            return `f${f.columnId}.value = '${f.value}'`;
          case "<":
            return `f${f.columnId}.value < ${f.value}`;
          case ">":
            return `f${f.columnId}.value > ${f.value}`;
          case "contains":
            return `f${f.columnId}.value ilike '%${f.value}%'`;
          case "does not contain":
            return `f${f.columnId}.value not ilike '%${f.value}%'`;
          case "is empty":
            return `f${f.columnId}.value is null or f${f.columnId}.value = ''`;
          case "is not empty":
            return `f${f.columnId}.value is not null and f${f.columnId}.value != ''`;
        }
      });
      const limit = input.limit ?? 50;

      const qry = `
        select
          r.id${columns.length > 0 ? "," : ""}
          ${columns.map((c) => `f${c.id}.value as f${c.id}`).join(",\n")}
        from "Row" r

        ${columns
          .map(
            (c) =>
              `
              left join (
                select "rowId", ${c.type === "Number" ? `value::int` : `value`} as value
                from "Cell"
                where "columnId" = ${c.id}
              ) as c${c.id} on c${c.id}."rowId" = r.id
            `,
          )
          .join("\n")}

        where r."tableId" = '${input.tableId}'
        ${filterConditions.length > 0 ? "\nand " + filterConditions.join("and\n") : ""}

        order by
        ${sorts.map((s) => `f${s.columnId}.value ${s.order}`).join(",\n")}
          ${sorts.length > 0 ? "," : ""}r.id
          
        limit ${limit + 1}
        offset ${input.cursor ?? 0}
        ;
      `;

      const rows =
        await ctx.db.$queryRawUnsafe<Record<string, string | number>[]>(qry);

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (!input.cursor) {
        nextCursor = limit + 1;
      } else if (rows.length > limit && input.cursor) {
        nextCursor = input.cursor + limit + 1;
      }

      return {
        rows,
        nextCursor,
      };
    }),

  getColumns: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const columns = await ctx.db.column.findMany({
        where: {
          tableId: input.tableId,
          Table: {
            Project: {
              userId: ctx.session.user.id,
            },
          },
        },
        orderBy: { id: "asc" },
      });
      return columns;
    }),

  getViews: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const views = await ctx.db.view.findMany({
        orderBy: { created: "asc" },
        where: { tableId: input.tableId },
      });
      return views;
    }),

  getLastView: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const view = await ctx.db.view.findFirst({
        where: { tableId: input.id },
        orderBy: { modified: "desc" },
      });

      return view;
    }),

  search: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
        viewId: z.string(),
        search: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const view = await ctx.db.view.findUnique({
        where: {
          id: input.viewId,
          Table: { Project: { userId: ctx.session.user.id } },
        },
      });
      if (!view) throw new Error("View not found");

      const hiddenColumns = view.hiddenColumns;
      const columns = await ctx.db.column.findMany({
        where: {
          tableId: input.tableId,
          id: {
            notIn: hiddenColumns.length > 0 ? hiddenColumns : undefined,
          },
        },
      });

      let sorts = view.sorts as Sort[];
      let filters = view.filters as Filter[];

      sorts = sorts.filter((s) => columns.some((c) => c.id === s.columnId));
      filters = filters.filter(
        (f) => f.value && columns.some((c) => c.id === f.columnId),
      );

      const filterConditions = filters.map((f) => {
        switch (f.type) {
          case "is":
            return `f${f.columnId}.value = '${f.value}'`;
          case "<":
            return `f${f.columnId}.value < ${f.value}`;
          case ">":
            return `f${f.columnId}.value > ${f.value}`;
          case "contains":
            return `f${f.columnId}.value ilike '%${f.value}%'`;
          case "does not contain":
            return `f${f.columnId}.value not ilike '%${f.value}%'`;
          case "is empty":
            return `f${f.columnId}.value is null or f${f.columnId}.value = ''`;
          case "is not empty":
            return `f${f.columnId}.value is not null and f${f.columnId}.value != ''`;
        }
      });

      const qry = `
        select
          r.id${columns.length > 0 ? "," : ""}
           ${columns
             .map(
               (c) => `
            case
              when f${c.id}.value::text ilike '%${input.search}%' 
                then f${c.id}.value
                else null
            end as f${c.id}
        `,
             )
             .join(",\n")}
        from "Row" r

        ${columns
          .map(
            (c) =>
              `
              left join (
                select "rowId", ${c.type === "Number" ? `value::int` : `value`} as value
                from "Cell"
                where "columnId" = ${c.id}
              ) as c${c.id} on c${c.id}."rowId" = r.id
            `,
          )
          .join("\n")}

        where r."tableId" = '${input.tableId}'
        ${filterConditions.length > 0 ? "\nand " + filterConditions.join("and\n") : ""}

        order by
        ${sorts.map((s) => `f${s.columnId}.value ${s.order}`).join(",\n")}
          ${sorts.length > 0 ? "," : ""}r.id
        ;
      `;

      const rows =
        await ctx.db.$queryRawUnsafe<Record<string, string | number>[]>(qry);

      const results: { rIdx: number; rId: number; cId: number }[] = [];
      for (const [idx, r] of rows.entries()) {
        for (const c of columns) {
          if (r[`f${c.id}`]) {
            results.push({
              rIdx: idx,
              rId: r.id !== undefined ? Number(r.id) : -1,
              cId: c.id,
            });
          }
        }
      }

      return results;
    }),
});
