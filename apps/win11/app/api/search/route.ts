import { NextRequest, NextResponse } from "next/server";

const CUSTOM_SEARCH_API_KEY = process.env.CUSTOM_SEARCH_API_KEY;
const CUSTOM_SEARCH_ENGINE_ID = process.env.CUSTOM_SEARCH_ENGINE_ID;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  if (!CUSTOM_SEARCH_API_KEY || !CUSTOM_SEARCH_ENGINE_ID) {
    return NextResponse.json(
      { error: "Search API credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const apiUrl = new URL("https://www.googleapis.com/customsearch/v1");
    apiUrl.searchParams.set("key", CUSTOM_SEARCH_API_KEY);
    apiUrl.searchParams.set("cx", CUSTOM_SEARCH_ENGINE_ID);
    apiUrl.searchParams.set("q", query);
    apiUrl.searchParams.set("num", "10"); // Number of results (max 10 per request)

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Google Search API Error:", errorData);
      
      // Return a more specific error for quota exceeded
      if (response.status === 429 || errorData.error?.message?.includes("quota")) {
        return NextResponse.json(
          { error: "Search quota exceeded. Please try again later.", quotaExceeded: true },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "Search API request failed", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform Google's response to match our SearchResult interface
    const results = data.items?.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
    })) || [];

    return NextResponse.json({
      results,
      searchInformation: {
        totalResults: data.searchInformation?.totalResults || "0",
        searchTime: data.searchInformation?.searchTime || 0,
      },
    });

  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal server error during search" },
      { status: 500 }
    );
  }
}
