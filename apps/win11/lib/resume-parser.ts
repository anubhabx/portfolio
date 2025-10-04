/**
 * Utility functions for parsing resume text from PDF
 */

export interface ParsedResumeData {
  name?: string;
  title?: string;
  sections: {
    [key: string]: string;
  };
}

/**
 * Parse resume text into structured data
 * This is a simple parser - adjust based on your actual resume format
 */
export function parseResumeText(text: string): ParsedResumeData {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const result: ParsedResumeData = {
    sections: {}
  };

  // Try to extract name (usually first line)
  if (lines.length > 0) {
    result.name = lines[0];
  }

  // Try to extract title (usually second line)
  if (lines.length > 1) {
    result.title = lines[1];
  }

  // Extract sections - look for common headers
  const sectionHeaders = [
    "experience",
    "education",
    "skills",
    "work experience",
    "professional experience",
    "technical skills",
    "projects",
    "certifications",
    "summary",
    "about"
  ];

  let currentSection = "summary";
  let currentText = "";

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const lowerLine = line.toLowerCase();

    // Check if this line is a section header
    const matchedSection = sectionHeaders.find((header) =>
      lowerLine.includes(header)
    );

    if (matchedSection) {
      // Save previous section
      if (currentText) {
        result.sections[currentSection] = currentText.trim();
      }
      currentSection = matchedSection;
      currentText = "";
    } else {
      currentText += line + "\n";
    }
  }

  // Save last section
  if (currentText) {
    result.sections[currentSection] = currentText.trim();
  }

  return result;
}

/**
 * Format section text for display
 */
export function formatSection(text: string): string[] {
  return text.split("\n").filter(Boolean);
}
