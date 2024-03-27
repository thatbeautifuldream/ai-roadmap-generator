import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "-.02em",
          fontWeight: 700,
          background: "white",
        }}
      >
        <div
          style={{
            right: 42,
            bottom: 42,
            position: "absolute",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              marginLeft: 8,
              fontSize: 20,
            }}
          >
            airoadmapgenerator.com
          </span>
        </div>
        <div
          style={{
            display: "flex",
            padding: "40px",
            border: "2px black",
            cursor: "pointer",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "600",
            fontSize: "40px",
            borderRadius: "2px",
            borderWidth: "2px",
            boxShadow: "10px 10px 0 1px rgba(0, 0, 0, 0.65)",
          }}
        >
          Machine Learning Roadmap
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
