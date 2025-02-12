import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { api } from "~/trpc/server";
import { TranscriptionPrediction } from "~/types/prediction";

export const runtime = "edge";
export const PREDICTION_MODELS = {
  transcribe: "thomasmol/whisper-diarization",
} as const;

function setCorsHeaders(res: Response) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
}

export function OPTIONS() {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
}

const handler = async (req: NextRequest) => {
  const prediction = (await req.json()) as TranscriptionPrediction;

  if (!prediction.input.consultationId) {
    console.error(
      "No consultationId found in prediction input",
      prediction.id ? `(prediction id: ${prediction.id})` : "",
    );
    return NextResponse.json({ error: "No consultationId found" });
  }

  if (prediction.status !== "succeeded") {
    console.error(
      "Prediction status is not succeeded",
      prediction.id ? `(prediction id: ${prediction.id})` : "",
    );
    return NextResponse.json({ error: "Prediction failed" });
  }

  try {
    if (prediction.model === PREDICTION_MODELS.transcribe) {
      await TranscriptionWebhookHandler(prediction);
    }
  } catch (error) {
    console.error("Error handling transcription webhook:", error);
    throw error;
  }

  const response = NextResponse.json({ received: true });
  setCorsHeaders(response);
  return response;
};

export { handler as GET, handler as POST };

const TranscriptionWebhookHandler = async (
  prediction: TranscriptionPrediction,
) => {
  await api.recording.updateByTranscriptionId.mutate({
    transcriptionId: prediction.id,
    transcriptionStatus: prediction.status,
    transcriptionCreatedAt: prediction.created_at,
    predictionObject: prediction.output,
  });
};
