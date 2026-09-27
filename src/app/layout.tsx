import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import type { ReactNode } from "react";

import GuideProvider from "@/components/guide/GuideProvider";
import FourthWallGuide from "@/components/guide/FourthWallGuide";
import ScrollWatcher from "@/components/guide/ScrollWatcher";
import IntroProvider from "@/components/intro/IntroProvider";
import IntroSequence from "@/components/intro/IntroSequence";
import MotionProvider from "@/components/layout/MotionProvider";
import Nav from "@/components/layout/Nav";
import SectionRail from "@/components/layout/SectionRail";
import SkipLink from "@/components/layout/SkipLink";
import SmoothScroll from "@/components/layout/SmoothScroll";
import CursorReticle from "@/components/ui/CursorReticle";
import { event } from "@/content/event";

import "./globals.css";

/* One grotesque for everything, one mono for the metadata. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${event.brand.wordmark} — ${event.brand.tagline}`,
  description: event.brand.tagline,
  openGraph: {
    title: event.brand.wordmark,
    description: event.brand.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        {/*
          Motion renders `initial` values into the SSR markup, which would leave
          the hero invisible without JavaScript. This hands it back.
        */}
        <noscript>
          <style>{`.hero-line{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <MotionProvider>
          <IntroProvider>
            <GuideProvider>
              <SmoothScroll>
                <SkipLink />
                <Nav />
                <SectionRail />
                <main id="main">{children}</main>
              </SmoothScroll>

              <IntroSequence />
              <ScrollWatcher />
              <CursorReticle />
              <FourthWallGuide />
            </GuideProvider>
          </IntroProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
