"use client";

import { useEffect, useState } from "react";
import Header2 from "@/components/Header2";
import Footer from "@/components/footer";
import useAuth from "@/hooks/useAuth";
import { apiRequest } from "@/utils/api";

type ResultType = "analyzer" | "summarizer";

interface Result {
  id: number;
  user_id: number;
  type: ResultType;
  sentiment: string | null;
  language: number | null;
  grammar: number | null;
  tone: string | null;
  plagiarism: number | null;
  topic: string | null;
  summary: string | null;
  created_at: string;
  input_text: string;
}

interface ResultsResponse {
  results: Result[];
  page: number;
  limit: number;
  count: number;
}

const typeLabel: Record<ResultType, string> = {
  analyzer: "Analyzer",
  summarizer: "Summarizer",
};

export default function ResultsHistoryPage() {
  const { loading: authLoading, isAuthenticated } = useAuth(true);

  const [results, setResults] = useState<Result[]>([]);
  const [filteredType, setFilteredType] = useState<"all" | ResultType>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | "" | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const query =
          filteredType === "all" ? "" : `?type=${encodeURIComponent(filteredType)}`;

        const data = await apiRequest<ResultsResponse>(
          `/results${query}`,
          "GET",
          undefined,
          true
        );

        setResults(data.results || []);
        if (data.results && data.results.length > 0) {
          setSelectedId(data.results[0].id);
        } else {
          setSelectedId(null);
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to load history."
        );
        setResults([]);
        setSelectedId(null);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchResults();
    }
  }, [filteredType, isAuthenticated]);

  if (authLoading) {
    return <p className="text-center mt-8">Checking authentication...</p>;
  }

  if (!isAuthenticated) {
    // Redirect is already handled in useAuth(true)
    return null;
  }

  const selected = results.find((r) => r.id === selectedId) || null;

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--color-BG)" }}
    >
      <Header2 />

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-6 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-P2)]">
              Result History
            </h1>
            <p className="text-sm md:text-base text-[var(--color-Text)] opacity-80 mt-1">
              View your previous text analyses and summaries.
            </p>
          </div>

          {/* Filter buttons */}
          <div className="inline-flex rounded-2xl border border-[var(--color-P2)] overflow-hidden text-sm">
            {(["all", "analyzer", "summarizer"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilteredType(type as any)}
                className={`px-4 py-2 transition ${
                  filteredType === type
                    ? "bg-[var(--color-P2)] text-[var(--color-Text-Inverse)]"
                    : "bg-transparent text-[var(--color-Text)] hover:bg-[var(--color-P3)]/10"
                }`}
              >
                {type === "all" ? "All" : typeLabel[type as ResultType]}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-400 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-8 text-center text-[var(--color-Text)]">
            Loading your history...
          </p>
        ) : results.length === 0 ? (
          <p className="mt-8 text-center text-[var(--color-Text)] opacity-80">
            No results yet. Run the Analyzer or Summarizer to see your history
            here.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            {/* Left: list */}
            <div className="rounded-2xl border border-[var(--color-P2)] bg-[var(--color-BG)]/70 p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2 text-xs text-[var(--color-Text)] opacity-80 px-1">
                <span>
                  {results.length} result{results.length !== 1 && "s"} found
                </span>
              </div>
              <div className="max-h-[65vh] space-y-2 overflow-y-auto pr-1">
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={`w-full rounded-2xl border px-3 py-2 text-left text-sm transition
                      ${
                        selectedId === r.id
                          ? "border-[var(--color-P2)] bg-[var(--color-P2)]/10"
                          : "border-transparent hover:border-[var(--color-P3)] hover:bg-[var(--color-P3)]/5"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide">
                        {typeLabel[r.type]}
                      </span>
                      <span className="text-[11px] opacity-70">
                        {new Date(r.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs opacity-90">
                      {r.type === "summarizer"
                        ? r.topic || r.summary || "(no topic)"
                        : r.input_text || "(no input text)"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: detail */}
            <div className="rounded-2xl border border-[var(--color-P2)] bg-[var(--color-BG)]/70 p-4 shadow-sm">
              {!selected ? (
                <p className="text-sm text-[var(--color-Text)] opacity-80">
                  Select a result from the list to see details.
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-full border px-3 py-1 text-xs uppercase tracking-wide">
                      {typeLabel[selected.type]}
                    </span>
                    <span className="text-xs opacity-70">
                      {new Date(selected.created_at).toLocaleString()}
                    </span>
                  </div>

                  {selected.type === "analyzer" ? (
                    <>
                      <h2 className="text-sm font-semibold mb-2 text-[var(--color-Text)]">
                        Analysis metrics
                      </h2>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <Stat
                          label="Language score"
                          value={
                            selected.language !== null
                              ? String(selected.language)
                              : "-"
                          }
                        />
                        <Stat
                          label="Grammar score"
                          value={
                            selected.grammar !== null
                              ? String(selected.grammar)
                              : "-"
                          }
                        />
                        <Stat
                          label="Plagiarism"
                          value={
                            selected.plagiarism !== null
                              ? `${selected.plagiarism}%`
                              : "-"
                          }
                        />
                        <Stat label="Tone" value={selected.tone || "-"} />
                      </div>
                      {selected.sentiment && (
                        <div className="mt-3 text-xs">
                          <span className="font-semibold">Sentiment: </span>
                          <span>{selected.sentiment}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <h2 className="text-sm font-semibold mb-2 text-[var(--color-Text)]">
                        Summary
                      </h2>
                      {selected.topic && (
                        <p className="mb-2 text-xs font-medium opacity-90">
                          Topic: {selected.topic}
                        </p>
                      )}
                      <div className="rounded-xl border border-[var(--color-P3)]/60 bg-[var(--color-BG)] p-3 text-sm leading-relaxed">
                        {selected.summary}
                      </div>
                    </>
                  )}

                  <div className="mt-4">
                    <h3 className="mb-1 text-xs font-semibold opacity-80">
                      Original text
                    </h3>
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-[var(--color-P3)]/60 bg-[var(--color-BG)] p-3 text-xs leading-relaxed">
                      {selected.input_text}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-xl border border-[var(--color-P3)]/60 bg-[var(--color-BG)] p-2">
      <div className="text-[11px] opacity-70 mb-0.5">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
