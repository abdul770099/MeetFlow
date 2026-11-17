import React, { useEffect, useRef, useState } from 'react';
import {
  UploadCloud,
  FileAudio,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { MeetingRecord } from '../types/meeting';
import { generateSimulatedMeetingRecord } from '../data/mockMeetings';

interface UploadMeetingViewProps {
  defaultOwner: string;
  onMeetingGenerated: (meeting: MeetingRecord) => void;
}

interface SelectedAudioFile {
  name: string;
  sizeBytes: number;
  extension: 'MP3' | 'WAV';
}

const PROCESSING_STEPS = [
  'Reading audio file metadata and normalizing stream',
  'Segmenting speakers and conversation turns',
  'Synthesizing meeting summary and key decisions',
  'Extracting action items, owners, and deadlines',
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function deriveTitleFromFileName(fileName: string): string {
  const withoutExt = fileName.replace(/\.(mp3|wav)$/i, '');
  const spaced = withoutExt.replace(/[_-]+/g, ' ').trim();
  if (!spaced) return '';
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function UploadMeetingView({
  defaultOwner,
  onMeetingGenerated,
}: UploadMeetingViewProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<SelectedAudioFile | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-11-17');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const validateAndAttachFile = (file: File) => {
    setErrorMsg(null);
    const lowerName = file.name.toLowerCase();
    const isMp3 = lowerName.endsWith('.mp3') || file.type === 'audio/mpeg';
    const isWav =
      lowerName.endsWith('.wav') ||
      file.type === 'audio/wav' ||
      file.type === 'audio/x-wav';

    if (!isMp3 && !isWav) {
      setErrorMsg(
        'Unsupported audio format. Please upload an MP3 (.mp3) or WAV (.wav) file.'
      );
      return;
    }

    const extension: 'MP3' | 'WAV' = isWav ? 'WAV' : 'MP3';
    setSelectedFile({
      name: file.name,
      sizeBytes: file.size,
      extension,
    });

    if (!title.trim()) {
      setTitle(deriveTitleFromFileName(file.name));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndAttachFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isProcessing) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndAttachFile(file);
    }
  };

  const handleLoadSampleFile = () => {
    setErrorMsg(null);
    const sampleName = 'sprint_planning_nov_17.mp3';
    setSelectedFile({
      name: sampleName,
      sizeBytes: 12_800_000,
      extension: 'MP3',
    });
    if (!title.trim()) {
      setTitle('Sprint 14 Engineering & Product Planning');
    }
  };

  useEffect(() => {
    if (!isProcessing || !selectedFile) return;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 4);
        if (next < 25) setActiveStepIndex(0);
        else if (next < 55) setActiveStepIndex(1);
        else if (next < 82) setActiveStepIndex(2);
        else setActiveStepIndex(3);

        if (next >= 100) {
          window.clearInterval(timer);
          window.setTimeout(() => {
            const generated = generateSimulatedMeetingRecord({
              title: title.trim() || deriveTitleFromFileName(selectedFile.name),
              date,
              audioFileName: selectedFile.name,
              fileSizeBytes: selectedFile.sizeBytes,
              defaultOwner,
            });
            setIsProcessing(false);
            onMeetingGenerated(generated);
          }, 350);
        }
        return next;
      });
    }, 95);

    return () => window.clearInterval(timer);
  }, [isProcessing, selectedFile, title, date, defaultOwner, onMeetingGenerated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedFile) {
      setErrorMsg('Please select or drop an MP3 or WAV audio file first.');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Please enter a meeting title.');
      return;
    }

    if (!date) {
      setErrorMsg('Please choose a meeting date.');
      return;
    }

    setProgress(4);
    setActiveStepIndex(0);
    setIsProcessing(true);
  };

  const handleCancelProcessing = () => {
    setIsProcessing(false);
    setProgress(0);
    setActiveStepIndex(0);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#0F2440]">
          Upload Meeting Recording
        </h1>
        <p className="mt-1.5 text-sm text-[#475569]">
          Upload an MP3 or WAV audio file to generate structured minutes, key decisions, and action items.
        </p>
      </div>

      {isProcessing && selectedFile ? (
        <section
          aria-live="polite"
          className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05)] sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-[#0F2440]">
                  Generating Meeting Minutes
                </h2>
                <p className="text-xs text-[#475569]">
                  {selectedFile.name} · {formatFileSize(selectedFile.sizeBytes)}
                </p>
              </div>
            </div>
            <span className="font-mono text-sm font-semibold text-[#1D4ED8] tabular-nums">
              {progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#2563EB] transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stage Checklist */}
          <ul className="mt-6 space-y-3 border-t border-slate-200/80 pt-5">
            {PROCESSING_STEPS.map((stepLabel, idx) => {
              const isDone = idx < activeStepIndex || progress === 100;
              const isCurrent = idx === activeStepIndex && progress < 100;

              return (
                <li key={stepLabel} className="flex items-center gap-3 text-sm">
                  {isDone ? (
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                  ) : isCurrent ? (
                    <Loader2
                      className="h-4 w-4 shrink-0 animate-spin text-[#2563EB]"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-slate-300 bg-white"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={
                      isDone || isCurrent
                        ? 'font-medium text-[#0F2440]'
                        : 'text-[#475569]'
                    }
                  >
                    {stepLabel}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200/80 pt-4">
            <p className="text-xs text-[#475569]">
              Simulated client-side preview workflow
            </p>
            <button
              type="button"
              onClick={handleCancelProcessing}
              className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-[#475569] hover:bg-slate-50 hover:text-[#0F2440] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Cancel
            </button>
          </div>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05)] sm:p-8"
        >
          {/* Drag and Drop Area */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-sm font-semibold text-[#0F2440]">
                Audio Recording (MP3 or WAV)
              </label>
              {!selectedFile && (
                <button
                  type="button"
                  onClick={handleLoadSampleFile}
                  className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] hover:underline focus:outline-none focus-visible:underline"
                >
                  Use sample recording
                </button>
              )}
            </div>

            {!selectedFile ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
                className={`mt-2.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isDragging
                    ? 'border-[#2563EB] bg-[#EFF6FF]'
                    : 'border-slate-300 bg-[#F8FAFC] hover:border-blue-400 hover:bg-[#F0F7FF]'
                }`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                  <UploadCloud className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold text-[#0F2440]">
                  Drag and drop your audio file here, or click to browse
                </p>
                <p className="mt-1 text-xs text-[#475569]">
                  Supports MP3 and WAV formats
                </p>
              </div>
            ) : (
              <div className="mt-2.5 flex items-center justify-between gap-4 rounded-xl border border-blue-200 bg-[#F0F7FF] px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#2563EB] border border-blue-100">
                    <FileAudio className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0F2440]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-[#475569] tabular-nums">
                      {selectedFile.extension} · {formatFileSize(selectedFile.sizeBytes)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  aria-label="Remove selected audio file"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#475569] hover:bg-white hover:text-[#0F2440] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,audio/mpeg,audio/wav"
              onChange={handleFileInputChange}
              className="sr-only"
            />
          </div>

          {/* Meeting Metadata Fields */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label
                htmlFor="meeting-title"
                className="block text-sm font-semibold text-[#0F2440]"
              >
                Meeting Title
              </label>
              <input
                id="meeting-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekly Engineering Sync"
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-[#0F2440] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label
                htmlFor="meeting-date"
                className="block text-sm font-semibold text-[#0F2440]"
              >
                Meeting Date
              </label>
              <input
                id="meeting-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-[#0F2440] tabular-nums focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="mt-5 flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Footer */}
          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#475569]">
              Simulated AI processing generates structured sample minutes for preview.
            </p>
            <button
              type="submit"
              disabled={!selectedFile}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 text-sm font-medium text-white shadow-xs transition-colors duration-150 hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Generate Minutes</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
