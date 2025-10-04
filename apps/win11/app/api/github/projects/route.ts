import { NextRequest, NextResponse } from "next/server";
import { fetchPortfolioProjects } from "@/lib/github-api";
import { getAllTechnologies } from "@/lib/github-utils";

// Cache duration in seconds (5 minutes)
const CACHE_DURATION = 300;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const projects = await fetchPortfolioProjects(username);
    const technologies = getAllTechnologies(projects);

    return NextResponse.json(
      {
        projects,
        technologies,
        count: projects.length,
        lastUpdated: new Date().toISOString()
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate`
        }
      }
    );
  } catch (error) {
    console.error("Error in GitHub projects API:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
