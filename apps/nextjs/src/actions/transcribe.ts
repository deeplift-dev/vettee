"use server";

import transcriptionService from "~/services/transcription";

export async function transcribe(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    const vocabulary = formData.get("vocabulary") as string;
    const language = formData.get("language") as string;
    const speakers = parseInt(formData.get("speakers") as string);

    if (isNaN(speakers)) {
      throw new Error("Invalid number of speakers");
    }

    const transcription = await transcriptionService.transcribe(formData);

    console.log(transcription);

    return transcription;
  } catch (error) {
    console.error("Transcription error:", error);
    return { error: error.message };
  }
}
