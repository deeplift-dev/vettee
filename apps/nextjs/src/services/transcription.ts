import Replicate from "replicate";

import { transcriptionPrompt } from "~/lib/prompt";
import { api } from "~/trpc/server";

const replicate = new Replicate();

const transcriptionService = {
  mergeAudioChunks: async (chunks: Blob[]): Promise<Blob> => {
    return new Blob(chunks, { type: "audio/webm; codecs=opus" });
  },

  transcribe: async (formData: FormData) => {
    try {
      const file = formData.get("file") as File;
      const animalId = formData.get("animalId") as string;
      const consultationId = formData.get("consultationId") as string;

      const input = {
        file,
        prompt: transcriptionPrompt,
        file_url: "",
        language: "en",
        num_speakers: 2,
        consultationId,
      };

      const prediction = await replicate.deployments.predictions.create(
        "deeplift-dev",
        "vetski-transcriber",
        {
          input,
          wait: 20,
          webhook:
            "https://stud-immortal-mildly.ngrok-free.app/api/predictions",
        },
      );
      // const audioBuffer = await file.arrayBuffer();
      // const audioBase64 = Buffer.from(audioBuffer).toString("base64");
      // // Save transcription using tRPC
      if (prediction.id) {
        await api.recording.saveTranscription.mutate({
          consultationId,
          transcriptionId: prediction.id,
          transcriptionUrl: prediction.urls.get,
          transcriptionStatus: prediction.status,
          transcriptionCreatedAt: prediction.created_at,
        });
      }

      return prediction;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

export default transcriptionService;
