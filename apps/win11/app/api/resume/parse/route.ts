import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { pdf } from "pdf-parse";

export async function GET() {
  try {
    // Read the PDF file from the public directory
    const pdfPath = path.join(process.cwd(), "public", "resume.pdf");
    const dataBuffer = await fs.readFile(pdfPath);

    // Parse the PDF
    const data = await pdf(dataBuffer);

    return NextResponse.json({
      text: data.text,
      pages: data.total,
      pageData: data.pages
    });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json(
      { error: "Failed to parse resume PDF" },
      { status: 500 }
    );
  }
}
