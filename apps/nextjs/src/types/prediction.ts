export interface TranscriptionPrediction {
  id: string;
  model: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  created_at: string;
  completed_at?: string;
  input: {
    consultationId?: string;
    audio?: string;
    [key: string]: any;
  };
  output?: {
    transcription?: string;
    segments?: Array<{
      start: number;
      end: number;
      text: string;
      speaker?: string;
    }>;
    [key: string]: any;
  };
  error?: string;
}