import { router } from "@/server/api/trpc";
import { campusRouter } from "@/server/api/routers/campus";
import { enrollmentRouter } from "@/server/api/routers/enrollment";
import { examsRouter } from "@/server/api/routers/exams";

export const appRouter = router({
  campus: campusRouter,
  enrollment: enrollmentRouter,
  exams: examsRouter,
});

export type AppRouter = typeof appRouter;
