interface Segment {
  speaker: string;
  text: string;
}

interface TranscriptionData {
  segments: Segment[];
  transcriptionCreatedAt: string | Date;
}

interface FormattedTranscription {
  segments: Segment[];
  createdAt: string;
}

export function formatTranscriptions(transcriptions: TranscriptionData[]): {
  transcriptionData: TranscriptionData[];
  formattedTranscriptions: FormattedTranscription[];
  concatenatedTranscription: string;
} {
  if (!transcriptions)
    return {
      transcriptionData: [],
      formattedTranscriptions: [],
      concatenatedTranscription: "",
    };

  const transcriptionData = transcriptions
    .filter((t) => t.predictionObject)
    .map((t) => ({
      segments: t.predictionObject.segments.map((segment) => ({
        speaker: segment.speaker,
        text: segment.text,
      })),
      createdAt: t.transcriptionCreatedAt,
    }));

  const formattedTranscriptions = transcriptionData.map((t) => ({
    segments: t.segments,
    createdAt: new Date(t.createdAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  }));

  const concatenatedTranscription = transcriptionData
    .map((t) => t.segments.map((s) => `[${s.speaker}] ${s.text}`).join("\n"))
    .join("\n\n");

  return {
    transcriptionData,
    formattedTranscriptions,
    concatenatedTranscription,
  };
}
