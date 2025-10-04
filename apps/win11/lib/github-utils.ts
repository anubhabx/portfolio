import type { PortfolioProject } from "./github-api";

/**
 * Get all unique technologies from projects
 */
export function getAllTechnologies(projects: PortfolioProject[]): string[] {
  const techSet = new Set<string>();

  projects.forEach((project) => {
    project.tags.forEach((tag) => techSet.add(tag));
  });

  return Array.from(techSet).sort();
}
