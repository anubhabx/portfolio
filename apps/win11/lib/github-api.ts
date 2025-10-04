import { Octokit } from "@octokit/rest";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  languages_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  github: string;
  demo: string | null;
  featured: boolean;
  year: number;
  stars: number;
  forks: number;
}

const PORTFOLIO_TAG = "portfolio-project"; // Repos must have this topic
const FEATURED_TAG = "featured"; // Optional tag for featured projects

// Initialize Octokit with optional auth token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN // Optional: Add to .env.local for higher rate limits
});

/**
 * Fetch all repositories for a GitHub user
 */
export async function fetchGitHubRepos(
  username: string
): Promise<GitHubRepo[]> {
  try {
    const { data } = await octokit.repos.listForUser({
      username,
      type: "owner",
      sort: "updated",
      per_page: 100
    });

    return data as GitHubRepo[];
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}

/**
 * Fetch languages for a repository
 */
async function fetchRepoLanguages(
  owner: string,
  repo: string
): Promise<string[]> {
  try {
    const { data } = await octokit.repos.listLanguages({
      owner,
      repo
    });

    return Object.keys(data);
  } catch (error) {
    console.error(`Error fetching languages for ${repo}:`, error);
    return [];
  }
}

/**
 * Convert GitHub repo to portfolio project
 */
async function repoToProject(
  repo: GitHubRepo
): Promise<PortfolioProject | null> {
  // Only include repos with the portfolio tag
  if (!repo.topics?.includes(PORTFOLIO_TAG)) {
    return null;
  }

  const [owner, repoName] = repo.full_name.split("/");

  // Fetch languages if not in topics
  let languages = repo.topics.filter(
    (topic) =>
      ![
        "portfolio-project",
        "featured",
        "web",
        "mobile",
        "tools",
        "api"
      ].includes(topic)
  );

  if (languages.length === 0) {
    languages = await fetchRepoLanguages(owner as string, repoName as string);
  }

  // Add primary language if available
  if (repo.language && !languages.includes(repo.language)) {
    languages.unshift(repo.language);
  }

  // Determine category from topics
  let category = "web"; // default
  if (repo.topics.includes("mobile")) category = "mobile";
  else if (repo.topics.includes("tools")) category = "tools";
  else if (repo.topics.includes("api")) category = "api";

  return {
    id: repo.name,
    title: formatRepoName(repo.name),
    description: repo.description || "No description available",
    image: `/api/placeholder/300/200`, // You can customize this
    tags: languages,
    category,
    github: repo.html_url,
    demo: repo.homepage || null,
    featured: repo.topics?.includes(FEATURED_TAG) || false,
    year: new Date(repo.created_at).getFullYear(),
    stars: repo.stargazers_count,
    forks: repo.forks_count
  };
}

/**
 * Format repository name to title case
 */
function formatRepoName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Fetch and transform portfolio projects
 */
export async function fetchPortfolioProjects(
  username: string
): Promise<PortfolioProject[]> {
  const repos = await fetchGitHubRepos(username);

  const projects = await Promise.all(repos.map((repo) => repoToProject(repo)));

  // Filter out nulls and sort by featured, then by updated date
  return projects
    .filter((project): project is PortfolioProject => project !== null)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.year - a.year;
    });
}
