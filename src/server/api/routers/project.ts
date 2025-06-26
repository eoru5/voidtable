import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createTable } from "./table";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
      // add a default table
      await createTable(ctx.db, project.id, "Table 1");
      return project;
    }),

  // non-mutating route to get project including most recent modified/opened table and view
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          Table: {
            orderBy: { modified: "desc" },
            take: 1,
            include: {
              View: {
                orderBy: { modified: "desc" },
                take: 1,
              },
            },
          },
        },
      });
      return project;
    }),

  // mutating route to open a project and update the modified values
  open: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        tableId: z.string(),
        viewId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: { modified: new Date() },
      });
      if (!project) throw new Error("Project not found");

      const table = await ctx.db.table.update({
        where: { id: input.tableId },
        data: { modified: new Date() },
      });
      if (!table) throw new Error("Table not found");

      const view = await ctx.db.view.update({
        where: { id: input.viewId },
        data: { modified: new Date() },
      });
      if (!view) throw new Error("View not found");

      return { project, table, view };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      orderBy: { modified: "desc" },
      where: { userId: ctx.session.user.id },
    });
    return projects;
  }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.project.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
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
      return ctx.db.project.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name,
          modified: new Date(),
        },
      });
    }),
});
