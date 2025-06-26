import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { projectRouter } from "./routers/project";
import { cellRouter } from "./routers/cell";
import { columnRouter } from "./routers/column";
import { rowRouter } from "./routers/row";
import { viewRouter } from "./routers/view";
import { tableRouter } from "./routers/table";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  project: projectRouter,
  table: tableRouter,
  view: viewRouter,
  column: columnRouter,
  row: rowRouter,
  cell: cellRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
