import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { DesktopProvider } from "@/contexts/DesktopContext";
import { TaskbarProvider } from "@/contexts/TaskbarContext";
import { WallpaperProvider } from "@/contexts/WallpaperContext";
import { WindowManagerProvider } from "@/components/WindowManager";
import Taskbar from "@/components/Taskbar";
import Desktop from "@/components/Desktop";
import Wallpaper from "@/components/Wallpaper";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: {
    default: "Anubhab Debnath - Full Stack Developer & UI Designer",
    template: "%s | Anubhab Debnath"
  },
  description: "Full-Stack Web Developer and UI Designer passionate about building scalable, user-centric applications. Experienced in React, TypeScript, and cloud deployment with AWS.",
  keywords: [
    "Full Stack Developer",
    "Web Developer",
    "UI Designer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Portfolio",
    "Anubhab Debnath"
  ],
  authors: [{ name: "Anubhab Debnath", url: "https://anubhabx.me" }],
  creator: "Anubhab Debnath",
  metadataBase: new URL("https://anubhabx.me"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anubhabx.me",
    title: "Anubhab Debnath - Full Stack Developer & UI Designer",
    description: "Full-Stack Web Developer and UI Designer passionate about building scalable, user-centric applications.",
    siteName: "Anubhab Debnath Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Anubhab Debnath - Full Stack Developer & UI Designer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Anubhab Debnath - Full Stack Developer & UI Designer",
    description: "Full-Stack Web Developer and UI Designer passionate about building scalable, user-centric applications.",
    images: ["/og-image.png"],
    creator: "@anubhabx"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <Providers>
          <WallpaperProvider>
            <DesktopProvider>
              <TaskbarProvider>
                <WindowManagerProvider>
                  <Wallpaper />
                  <div className="min-h-svh text-foreground/90">
                    <Desktop />
                  </div>
                  <Taskbar />
                </WindowManagerProvider>
              </TaskbarProvider>
            </DesktopProvider>
          </WallpaperProvider>
        </Providers>
      </body>
    </html>
  );
}
