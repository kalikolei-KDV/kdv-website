import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { Content, isFilled } from "@prismicio/client";
import "./globals.css";

import { createClient } from "@/prismicio";
import Footer from "@/slices/Footer";
import Navigation from "@/slices/Navigation";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});

const IMAGE_EXTENSION_MIME_TYPES: Record<string, string> = {
  ico: "image/x-icon",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  gif: "image/gif",
  webp: "image/webp",
};

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle("settings").catch(() => null);
  const favicon = settings?.data.favicon;

  const icon = isFilled.image(favicon)
    ? {
        url: favicon.url,
        sizes: favicon.dimensions
          ? `${favicon.dimensions.width}x${favicon.dimensions.height}`
          : undefined,
        type: IMAGE_EXTENSION_MIME_TYPES[
          favicon.url.split("?")[0].split(".").pop() ?? ""
        ],
      }
    : "/favicon.ico";

  return {
    title: "Figma + Prismic Starter",
    description:
      "Next.js starter wired up for Prismic content and Figma-derived components.",
    icons: { icon },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = createClient();
  const settings = await client.getSingle("settings").catch(() => null);
  const navigationSlice = Array.from(settings?.data.slices ?? []).find(
    (slice): slice is Content.NavigationSlice =>
      slice.slice_type === "navigation",
  );
  const footerSlice = Array.from(settings?.data.slices ?? []).find(
    (slice): slice is Content.FooterSlice => slice.slice_type === "footer",
  );

  const headScripts = settings?.data.head_scripts;
  const bodyStartScripts = settings?.data.body_start_scripts;
  const bodyEndScripts = settings?.data.body_end_scripts;

  return (
    <html
      lang="en"
      className={`h-full antialiased ${instrumentSans.variable} ${ibmPlexMono.variable}`}
    >
      {isFilled.keyText(headScripts) && (
        <head dangerouslySetInnerHTML={{ __html: headScripts }} />
      )}
      <body className="min-h-full flex flex-col font-sans">
        {isFilled.keyText(bodyStartScripts) && (
          <div dangerouslySetInnerHTML={{ __html: bodyStartScripts }} />
        )}
        {navigationSlice && (
          <Navigation
            slice={navigationSlice}
            index={0}
            slices={[navigationSlice]}
            context={undefined}
          />
        )}
        <div className="flex-1">{children}</div>
        {footerSlice && (
          <Footer
            slice={footerSlice}
            index={0}
            slices={[footerSlice]}
            context={undefined}
          />
        )}
        {isFilled.keyText(bodyEndScripts) && (
          <div dangerouslySetInnerHTML={{ __html: bodyEndScripts }} />
        )}
      </body>
    </html>
  );
}
