"use client";

import * as React from "react";
import type { PortfolioProject } from "@/lib/github-api";

interface UseGitHubProjectsOptions {
  username: string;
  refreshInterval?: number; // in milliseconds, default 5 minutes
}

interface UseGitHubProjectsReturn {
  projects: PortfolioProject[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useGitHubProjects({
  username,
  refreshInterval = 5 * 60 * 1000 // 5 minutes
}: UseGitHubProjectsOptions): UseGitHubProjectsReturn {
  const [projects, setProjects] = React.useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  const fetchProjects = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/github/projects?username=${username}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      const data = await response.json();
      setProjects(data.projects);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      console.error("Error fetching GitHub projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  // Initial fetch
  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Set up auto-refresh interval
  React.useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      fetchProjects();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchProjects, refreshInterval]);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
    lastUpdated
  };
}
