"use client";

import { useState, useTransition } from "react";
import { saveTimerConfig } from "@/components/actions/timerActions";

export default function LandingPage() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        // Validate it's actually JSON before storing
        JSON.parse(content);
        setJsonInput(content);
        setError(null);
      } catch (err) {
        setError("The file content is not a valid JSON format.");
      }
    };
    reader.readAsText(file);
  };

  const handleGenerate = () => {
    if (!jsonInput || !slug) {
      setError("Please ensure both a slug and a JSON file are provided.");
      return;
    }

    // useTransition handles the "Pending" state for Server Actions automatically
    startTransition(async () => {
      const result = await saveTimerConfig(slug, jsonInput);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <main className="site-background svg-background min-h-screen w-full flex flex-col items-center justify-center p-6 transition-all duration-700">
      {/* Container Card */}
      <div className="max-w-xl w-full space-y-8 bg-black/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-white">
            Timer <span className="text-(--site-4)">Studio</span>
          </h1>
          <p className="text-neutral-400 mt-2 text-xs uppercase tracking-[0.3em] font-black opacity-70">
            Secure Configuration Upload
          </p>
        </div>

        <div className="space-y-6">
          {/* 1. SLUG INPUT */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black mb-3 ml-1">
              Secret Identifier (Slug)
            </label>
            <input
              type="text"
              placeholder="e.g. secret-schedule-2026"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[var(--site-1)]/40 transition-all placeholder:text-neutral-700"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())
              }
              disabled={isPending}
            />
          </div>

          {/* 2. FILE UPLOAD AREA */}
          <div className="relative group">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black mb-3 ml-1">
              Configuration JSON
            </label>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all bg-white/5
              ${jsonInput ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 hover:border-white/20"}`}
            >
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={isPending}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div className="space-y-3">
                <div
                  className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-colors
                  ${jsonInput ? "bg-emerald-500 text-black" : "bg-white/10 text-neutral-400"}`}
                >
                  {jsonInput ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  )}
                </div>
                <p
                  className={`text-sm font-medium ${jsonInput ? "text-emerald-400" : "text-neutral-400"}`}
                >
                  {jsonInput
                    ? "JSON Successfully Loaded"
                    : "Upload Configuration"}
                </p>
              </div>
            </div>
          </div>

          {/* ERROR DISPLAY */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] text-center font-bold tracking-wide animate-pulse">
              {error}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            disabled={!jsonInput || !slug || isPending}
            onClick={handleGenerate}
            className="w-full group relative overflow-hidden rounded-2xl py-5 font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
          >
            <div className="absolute inset-0 bg-white transition-colors" />
            <span className="relative text-black">
              {isPending ? "Processing Vault..." : "Generate Secret Link"}
            </span>
          </button>
        </div>

        {/* Footer privacy info */}
        <p className="text-[9px] text-center text-neutral-600 uppercase tracking-[0.2em] leading-relaxed">
          The identifier you choose becomes the URL. <br />
          Keep it complex for higher discretion.
        </p>
      </div>
    </main>
  );
}
