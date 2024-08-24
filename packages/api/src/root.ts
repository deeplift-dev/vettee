import { animalRouter } from "./router/animal";
import { assistantRouter } from "./router/assistant";
import { authRouter } from "./router/auth";
import { profileRouter } from "./router/profile";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  assistant: assistantRouter,
  animal: animalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
