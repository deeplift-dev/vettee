interface Segment {
  speaker: string;
  text: string;
}

interface Transcription {
  predictionObject: {
    segments: Segment[];
  };
  transcriptionCreatedAt: string;
}

interface TranscriptionData {
  transcriptions: Transcription[];
  synced: boolean;
}

interface FormattedTranscription {
  segments: Segment[];
  createdAt: string;
}

export function formatTranscriptions(transcriptions: TranscriptionData): {
  transcriptionData: TranscriptionData[];
  formattedTranscriptions: FormattedTranscription[];
  concatenatedTranscription: string;
  synced: boolean;
} {
  if (!transcriptions)
    return {
      transcriptionData: [],
      formattedTranscriptions: [],
      concatenatedTranscription: "",
      synced: false,
      lastTranscriptionId: "",
    };

  const transcriptionData = transcriptions?.transcriptions
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

  const lastTranscriptionId = transcriptions.transcriptions
    .filter((t) => t.predictionObject)
    .sort(
      (a, b) =>
        new Date(b.transcriptionCreatedAt).getTime() -
        new Date(a.transcriptionCreatedAt).getTime(),
    )[0]?.id;

  return {
    formattedTranscriptions,
    concatenatedTranscription,
    transcriptionData: [transcriptions],
    synced: transcriptions.synced,
    lastTranscriptionId,
  };
}
