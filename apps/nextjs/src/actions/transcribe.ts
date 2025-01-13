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

    // console.log(transcription);

    // Here you would typically:
    // 1. Validate file type
    // 2. Check file size
    // 3. Save to storage (like Vercel Blob or cloud storage)

    return "ok";
  } catch (error) {
    console.error("Transcription error:", error);
    return { error: error.message };
  }
}
