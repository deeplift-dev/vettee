import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export async function POST(request: Request) {
  if (!request.headers.get("Content-Type")?.includes("multipart/form-data")) {
    return new NextResponse(JSON.stringify({ error: "Invalid content type" }), {
      status: 400,
    });
  }

  console.log(request.formData());

  const transcription = await transcriptionService.transcribe(
    request.formData(),
  );

  return NextResponse.json({
    message: "Received input",
    input: transcription,
  });

  const formData = await request.formData();
  const files = Object.fromEntries(formData.entries());

  return NextResponse.json({
    message: "Received input",
    input: files,
  });
}

const spectropicClient = axios.create({
  baseURL: "https://api.spectropic.ai/v1",
  headers: {
    Authorization: `Bearer ${process.env.SPECTROPIC_API_KEY}`,
  },
});

const transcriptionService = {
  post: async (endpoint: string, formData: FormData) => {
    try {
      const response = await spectropicClient.post(endpoint, formData);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  get: async (endpoint: string, params: any) => {
    try {
      const response = await spectropicClient.get(endpoint, { params });
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  transcribe: async (
    file: File,
    vocabulary: string,
    language: string,
    speakers: number,
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("vocabulary", vocabulary);
    formData.append("language", language);
    formData.append("model", "standard");
    formData.append("numSpeakers", speakers.toString());

    return transcriptionService.post("transcribe", formData);
  },
};

export default transcriptionService;
