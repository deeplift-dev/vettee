import { animal } from "./../../db/schema";
import { animalRouter } from "./router/animal";
import { assistantRouter } from "./router/assistant";
import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { profileRouter } from "./router/profile";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  profile: profileRouter,
  assistant: assistantRouter,
  animal: animalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
