import { useState } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRouteLoaderData,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { asText, isFilled, type Content } from "@prismicio/client";

import type { Route } from "./+types/root";
import { createClient } from "./prismicio";
import Navigation from "./slices/Navigation";
import Footer from "./slices/Footer";
import "./app.css";

const IMAGE_EXTENSION_MIME_TYPES: Record<string, string> = {
  ico: "image/x-icon",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  gif: "image/gif",
  webp: "image/webp",
};

/**
 * A pasted Google-Tag-Manager-style snippet may include its own wrapping
 * `<script>` tags. Strip a single outer pair if present so the content can
 * be re-inserted as the body of our own `<script>` element; otherwise treat
 * the value as already-bare inline JS.
 */
function extractInlineScript(raw: string): string {
  const trimmed = raw.trim();
  const match = trimmed.match(/^<script[^>]*>([\s\S]*)<\/script>$/i);
  return match ? match[1] : trimmed;
}

export async function loader() {
  const client = createClient();
  const settings = await client.getSingle("settings").catch(() => null);
  const slices = settings?.data.slices ?? [];

  const navigationSlice =
    (slices.find((slice) => slice.slice_type === "navigation") as
      Content.NavigationSlice | undefined) ?? null;
  const footerSlice =
    (slices.find((slice) => slice.slice_type === "footer") as
      Content.FooterSlice | undefined) ?? null;

  const faviconField = settings?.data.favicon;
  const favicon = isFilled.image(faviconField)
    ? {
        url: faviconField.url,
        sizes: faviconField.dimensions
          ? `${faviconField.dimensions.width}x${faviconField.dimensions.height}`
          : undefined,
        type: IMAGE_EXTENSION_MIME_TYPES[
          faviconField.url.split("?")[0].split(".").pop() ?? ""
        ],
      }
    : null;

  return {
    navigationSlice,
    footerSlice,
    favicon,
    headScript: isFilled.richText(settings?.data.head_scripts)
      ? extractInlineScript(asText(settings.data.head_scripts, "\n"))
      : null,
    bodyStartHtml: isFilled.richText(settings?.data.body_start_scripts)
      ? asText(settings.data.body_start_scripts, "\n")
      : null,
    bodyEndHtml: isFilled.richText(settings?.data.body_end_scripts)
      ? asText(settings.data.body_end_scripts, "\n")
      : null,
  };
}

type RootLoaderData = Awaited<ReturnType<typeof loader>>;

export function Layout({ children }: { children: React.ReactNode }) {
  // React Router's `SerializeFrom` mapped type mishandles Prismic's branded
  // slice union types (it loses the discriminant), so type this explicitly
  // from the loader's actual return type instead.
  const data = useRouteLoaderData("root") as RootLoaderData | undefined;

  // A route opts into the transparent/white-on-image nav variant via
  // `export const handle = { transparentNav: true }` (see
  // app/routes/case-study.tsx) rather than a prop threaded through the tree.
  const matches = useMatches();
  const transparentNav = matches.some(
    (match) =>
      (match.handle as { transparentNav?: boolean } | undefined)
        ?.transparentNav,
  );

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {data?.favicon ? (
          <link
            rel="icon"
            href={data.favicon.url}
            sizes={data.favicon.sizes}
            type={data.favicon.type}
          />
        ) : (
          <link rel="icon" href="/favicon.ico" />
        )}
        <Meta />
        <Links />
        {data?.headScript && (
          <script dangerouslySetInnerHTML={{ __html: data.headScript }} />
        )}
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {data?.bodyStartHtml && (
          <div dangerouslySetInnerHTML={{ __html: data.bodyStartHtml }} />
        )}
        {data?.navigationSlice && (
          <Navigation
            slice={data.navigationSlice}
            index={0}
            slices={[data.navigationSlice]}
            context={undefined}
            transparent={transparentNav}
          />
        )}
        <div className="flex-1">{children}</div>
        {data?.footerSlice && (
          <Footer
            slice={data.footerSlice}
            index={0}
            slices={[data.footerSlice]}
            context={undefined}
          />
        )}
        {data?.bodyEndHtml && (
          <div dangerouslySetInnerHTML={{ __html: data.bodyEndHtml }} />
        )}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
