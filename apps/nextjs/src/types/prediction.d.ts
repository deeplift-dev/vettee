interface Word {
  end: number;
  probability: number;
  start: number;
  word: string;
}

interface Segment {
  avg_logprob: number;
  end: number;
  speaker: string;
  start: number;
  text: string;
  words: Word[];
}

interface TranscriptionOutput {
  language: string;
  num_speakers: number;
  segments: Segment[];
}

interface TranscriptionInput {
  consultationId: string;
  file: string;
  file_url: string;
  language: string;
  num_speakers: number;
  prompt: string;
}

interface TranscriptionUrls {
  cancel: string;
  get: string;
}

interface TranscriptionMetrics {
  predict_time: number;
}

interface TranscriptionPrediction {
  completed_at: string;
  created_at: string;
  data_removed: boolean;
  error: string | null;
  id: string;
  input: TranscriptionInput;
  logs: string;
  metrics: TranscriptionMetrics;
  model: string;
  output: TranscriptionOutput;
  started_at: string;
  status: "succeeded" | "failed" | "processing" | "canceled";
  urls: TranscriptionUrls;
  version: string;
  webhook: string;
}

export type {
  Segment,
  TranscriptionInput,
  TranscriptionOutput,
  TranscriptionPrediction,
  Word,
};
