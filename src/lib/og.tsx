import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared per-page OG image renderer (§10) — brand card in the design system:
 * warm espresso base, gold glow, Bodoni display + mono eyebrow.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

async function loadFont(file: string): Promise<ArrayBuffer> {
  const buffer = await readFile(join(process.cwd(), "src/fonts/og", file));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

export async function renderOgImage({
  eyebrow,
  title,
  footer,
}: {
  eyebrow: string;
  title: string;
  footer?: string;
}) {
  const [bodoni, mono] = await Promise.all([
    loadFont("bodoni-moda-700.ttf"),
    loadFont("jetbrains-mono-500.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#FAF7F2",
          backgroundImage:
            "radial-gradient(800px 500px at 20% -10%, rgba(198,161,91,0.30), rgba(198,161,91,0.08) 50%, rgba(250,247,242,0) 75%)",
          border: "16px solid #FFFFFF",
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 26,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9C7C3C",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: "Bodoni Moda",
            fontSize: title.length > 34 ? 68 : 88,
            lineHeight: 1.05,
            color: "#201A12",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "JetBrains Mono",
            fontSize: 24,
            color: "#6F6049",
          }}
        >
          <span>{footer ?? "Dubai, UAE"}</span>
          <span style={{ color: "#9C7C3C" }}>DXBPROPERTY GATE</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bodoni Moda", data: bodoni, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}
