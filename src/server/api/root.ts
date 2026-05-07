import { router } from "@/server/api/trpc";
import { campusRouter } from "@/server/api/routers/campus";
import { enrollmentRouter } from "@/server/api/routers/enrollment";

export const appRouter = router({
  campus: campusRouter,
  enrollment: enrollmentRouter
});

export type AppRouter = typeof appRouter;
