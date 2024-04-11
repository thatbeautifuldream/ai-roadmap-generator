import { ImageResponse } from "next/og";
import { z } from "zod";

export const runtime = "edge";

export type Props = {
  title?: string;
};

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  const myBuffer = Buffer.from(binary, "binary"); // convert to buffer
  return myBuffer.toString("base64");
}
async function getImageSrcFromPath(url: URL) {
  const image = await fetch(url).then((res) => res.arrayBuffer());
  // get image src from arraybuffer
  // https://stackoverflow.com/a/18650249/3015595
  const base64Flag = "data:image/png;base64,";
  const imageStr = arrayBufferToBase64(image);
  return base64Flag + imageStr;
}

const paramsSchema = z.object({
  title: z.string(),
});

export async function GET(
  request: Request,
  { params }: { params: unknown }
): Promise<ImageResponse> {
  const { title: titleParam } = paramsSchema.parse(params);
  const title = decodeURIComponent(titleParam);
  // turn the first letter of the title capitalized
  const text = title.charAt(0).toUpperCase() + title.slice(1);
  const [docsImageSrc] = await Promise.all([
    getImageSrcFromPath(new URL("./base-og.png", import.meta.url)),
  ]);

  const nunitoSemiBold = fetch(
    new URL("@/fonts/nunito/Nunito-SemiBold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
        }}
      >
        <div tw="relative w-full flex justify-between flex-row">
          <img src={docsImageSrc} alt="image" tw="absolute" />
          <div tw="flex w-full justify-start pl-48 pt-85 text-black max-w-225">
            <p tw="text-8xl">{text}</p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1686,
      height: 882,
      fonts: [
        {
          name: "Nunito",
          data: await nunitoSemiBold,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
