import { Geist, Geist_Mono } from "next/font/google";

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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <WallpaperProvider>
            <DesktopProvider>
              <TaskbarProvider>
                <WindowManagerProvider>
                  <Wallpaper />
                  <div className="min-h-svh bg-gradient-to-br from-slate-900 via-slate-800 to-neutral-900 text-foreground/90">
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
