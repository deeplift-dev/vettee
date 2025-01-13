"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { transcribe } from "~/actions/transcribe";

const CHUNK_DURATION = 10000; // 10 seconds in milliseconds

const SpeechToText = () => {
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
        formData.append("animalId", props.animalId);
        if (props.consultId) {
          formData.append("consultId", props.consultId);
        }

        const response = await transcribe(formData);
        console.log(response);
      }
    },
    [vocabulary, language, speakers],
  );

  const recordChunk = useCallback(
    (mediaStream: MediaStream) => {
      // Use the ref instead of the state
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

        // Check ref value for recording state
        if (isRecordingRef.current) {
          recordChunk(mediaStream);
        }
      };

      // Start recording
      mediaRecorder.start();

      // Stop after CHUNK_DURATION
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
      // Update both state and ref
      setIsRecording(true);
      isRecordingRef.current = true;
      setError("");

      // Start the first chunk
      recordChunk(mediaStream);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start recording",
      );
      console.error("Stream error:", err);
    }
  }, [recordChunk]);

  const stopStream = useCallback(() => {
    // Update both state and ref
    setIsRecording(false);
    isRecordingRef.current = false;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="vocabulary"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Vocabulary
            </label>
            <select
              id="vocabulary"
              value={vocabulary}
              onChange={(e) => setVocabulary(e.target.value)}
              className="form-select mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="form-select mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="speakers"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Speakers
            </label>
            <select
              id="speakers"
              value={speakers}
              onChange={(e) => setSpeakers(e.target.value)}
              className="form-select mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <button
            onClick={startStream}
            disabled={isRecording}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isRecording ? "Recording..." : "Start Recording"}
          </button>
          <button
            onClick={stopStream}
            disabled={!isRecording}
            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Stop Recording
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;
