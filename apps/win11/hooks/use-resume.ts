"use client";

import * as React from "react";
import type { ResumeData } from "@/types/resume";

interface UseResumeReturn {
  resume: ResumeData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useResume(): UseResumeReturn {
  const [resume, setResume] = React.useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchResume = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/resume");

      if (!response.ok) {
        throw new Error(`Failed to fetch resume: ${response.statusText}`);
      }

      const data = await response.json();
      setResume(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      console.error("Error fetching resume:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  React.useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  return {
    resume,
    isLoading,
    error,
    refetch: fetchResume
  };
}
