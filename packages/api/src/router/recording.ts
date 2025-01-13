import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const recordingRouter = createTRPCRouter({
  transcribe: publicProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ input }) => {
      const data: FormData = input;
      // Log on server side to verify receipt
      console.log("Received input:", data);

      let transcription;
      try {
        // transcription = await transcriptionService.transcribe(
        //   data.get('file'),
        //   data.get('vocabulary'),
        //   data.get('language'),
        //   parseInt(data.get('speakers')),
        // );
        return {
          message: "File received",
          data,
        };
      } catch (error) {
        console.error("Failed to transcribe recording:", error);
        throw error;
      }
    }),
});
