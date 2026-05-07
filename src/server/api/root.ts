import { router } from "@/server/api/trpc";
import { campusRouter } from "@/server/api/routers/campus";

export const appRouter = router({
  campus: campusRouter
});

export type AppRouter = typeof appRouter;
