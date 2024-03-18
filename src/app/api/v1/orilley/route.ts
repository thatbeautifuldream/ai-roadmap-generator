import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const query = body.data.query;

    if (!query) {
      return NextResponse.json(
        { status: false, message: "Please send required params." },
        { status: 400 }
      );
    }

    const { data } = await axios.get(
      `https://learning.oreilly.com/api/v2/search/?query=${query}&formats=book&limit=2`
    );
    return NextResponse.json({ status: true, data }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { status: false, message: "Something went wrong." },
      { status: 400 }
    );
  }
};
