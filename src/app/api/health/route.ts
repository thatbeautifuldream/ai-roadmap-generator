import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({ status: true, message: "ok" }, { status: 200 });
};
