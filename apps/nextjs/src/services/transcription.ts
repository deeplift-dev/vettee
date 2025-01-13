
import Replicate from "replicate";
import { api } from "~/trpc/react";

const replicate = new Replicate();

const transcriptionService = {
  mergeAudioChunks: async (chunks: Blob[]): Promise<Blob> => {
    return new Blob(chunks, { type: "audio/webm; codecs=opus" });
  },

  transcribe: async (formData: FormData) => {
    try {
      const file = formData.get("file") as File;
      const animalId = formData.get("animalId") as string;
      const consultId = formData.get("consultId") as string;

      const input = {
        file,
        prompt: "LLama, AI, Meta.",
        file_url: "",
        language: "en",
        num_speakers: 2,
      };

      const prediction = await replicate.deployments.predictions.create(
        "deeplift-dev",
        "vetski-transcriber",
        { input },
      );

      if (prediction?.output?.text) {
        // Convert audio blob to base64
        const audioBuffer = await file.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString('base64');

        // Save transcription using tRPC
        await api.recording.saveTranscription.mutate({
          audioBlob: audioBase64,
          transcription: prediction.output.text,
          animalId,
          consultId,
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
