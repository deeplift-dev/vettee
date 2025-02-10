"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { transcribe } from "~/actions/transcribe";
import { Button } from "../ui/button";

const CHUNK_DURATION = 10000; // 10 seconds in milliseconds

interface SpeechToTextProps {
  consultationId: string | undefined;
  animalId: string | undefined;
}

const SpeechToText = ({ consultationId, animalId }: SpeechToTextProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");
  const [vocabulary, setVocabulary] = useState<string>("en");
  const [language, setLanguage] = useState<string>("en");
  const [speakers, setSpeakers] = useState<string>("1");
  const isRecordingRef = useRef(false);

  const processChunk = useCallback(
    async (chunkBlobs: Blob[]) => {
      if (chunkBlobs.length > 0) {
        const audioBlob = new Blob(chunkBlobs, {
          type: "audio/webm; codecs=opus",
        });

        const formData = new FormData();
        const timestamp = new Date().getTime();
        formData.append("file", audioBlob, `audio_${timestamp}.webm`);
        formData.append("vocabulary", vocabulary);
        formData.append("language", language);
        formData.append("speakers", speakers);
        formData.append("animalId", animalId ?? "");
        formData.append("consultationId", consultationId ?? "");

        const response = await transcribe(formData);
      }
    },
    [vocabulary, language, speakers],
  );

  const recordChunk = useCallback(
    (mediaStream: MediaStream) => {
      if (!isRecordingRef.current) return;

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: "audio/webm; codecs=opus",
      });

      const currentChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          currentChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (currentChunks.length > 0) {
          processChunk(currentChunks);
        }

        if (isRecordingRef.current) {
          recordChunk(mediaStream);
        }
      };

      mediaRecorder.start();

      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, CHUNK_DURATION);
    },
    [processChunk],
  );

  const startStream = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Media devices not supported in this browser");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (!MediaRecorder.isTypeSupported("audio/webm; codecs=opus")) {
        throw new Error(
          "audio/webm; codecs=opus not supported by this browser",
        );
      }

      setStream(mediaStream);
      setIsRecording(true);
      isRecordingRef.current = true;
      setError("");

      recordChunk(mediaStream);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start recording",
      );
      console.error("Stream error:", err);
    }
  }, [recordChunk]);

  const stopStream = useCallback(() => {
    setIsRecording(false);
    isRecordingRef.current = false;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopStream();
    } else {
      void startStream();
    }
  }, [isRecording, startStream, stopStream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div>
      <RecordingButton
        toggleRecording={toggleRecording}
        isRecording={isRecording}
        setSpeakers={setSpeakers}
        setLanguage={setLanguage}
        setVocabulary={setVocabulary}
      />
    </div>
  );
};

export default SpeechToText;

interface RecordingButtonProps {
  toggleRecording: () => void;
  isRecording: boolean;
  setSpeakers: (speakers: string) => void;
  setLanguage: (language: string) => void;
  setVocabulary: (vocabulary: string) => void;
}

const RecordingButton = ({
  toggleRecording,
  isRecording,
  setSpeakers,
  setLanguage,
  setVocabulary,
}: RecordingButtonProps) => {
  return (
    <div>
      <Button
        onClick={toggleRecording}
        className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
      >
        <div className="flex items-center gap-2">
          {isRecording ? (
            <>
              Stop Recording
              <div className="bg-destructive h-2 w-2 animate-pulse rounded-full" />
            </>
          ) : (
            "Start Recording"
          )}
        </div>
      </Button>
    </div>
  );
};
