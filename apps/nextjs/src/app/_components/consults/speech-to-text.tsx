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
        formData.append("animalId", "6lpsmrciEuy-A_cGcufeI");

        const response = await transcribe(formData);
        console.log(response);
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

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="relative flex w-full max-w-md flex-col gap-4 pt-24">
      <div className="absolute left-1/2 top-2/3 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform-gpu items-center justify-center overflow-hidden blur-3xl">
        <div className="h-full w-full bg-rose-200/60"></div>
      </div>
      <div className="w-full rounded-2xl border border-white/20 bg-black/95 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex items-center justify-center">
              <div className="h-12 w-12 rounded-lg bg-slate-900 text-lg">
                <div className="flex h-full w-full items-center justify-center"></div>
              </div>
            </div>
            <div className="text-center text-lg text-white">Speech to Text</div>
            {error && (
              <div className="text-center text-sm font-light text-red-500">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="vocabulary"
                  className="block text-sm font-medium text-white"
                >
                  Vocabulary
                </label>
                <select
                  id="vocabulary"
                  value={vocabulary}
                  onChange={(e) => setVocabulary(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-white"
                >
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="speakers"
                  className="block text-sm font-medium text-white"
                >
                  Speakers
                </label>
                <select
                  id="speakers"
                  value={speakers}
                  onChange={(e) => setSpeakers(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={startStream}
                  disabled={isRecording}
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isRecording ? "Recording..." : "Start Recording"}
                </button>
                <button
                  onClick={stopStream}
                  disabled={!isRecording}
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Stop Recording
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;
