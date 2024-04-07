import { db } from "@/lib/db";
import { ImageResponse } from "next/og";

// export const runtime = "edge";

export const alt = "AI Roadmap Generator";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const roadmap = await db.roadmap.findUnique({
    where: {
      id: params.id,
    },
    select: {
      title: true,
    },
  });

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
              marginLeft: 1,
              fontSize: 30,
            }}
          >
            airoadmapgenerator.com
          </span>
        </div>
        <div
          style={{
            display: "flex",
            padding: "40px",
            border: "black",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "800",
            fontSize: "50px",
            borderRadius: "5px",
            borderWidth: "5px",
            boxShadow: "10px 10px 0 5px rgba(0, 0, 0, 0.65)",
            textWrap: "wrap",
          }}
        >
          {roadmap?.title}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
