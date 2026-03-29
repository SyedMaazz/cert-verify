import { NextRequest, NextResponse } from "next/server";
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await pinata.upload.public.file(file);

    return NextResponse.json({ cid: result.cid }, { status: 200 });
  } catch (error) {
    console.error("IPFS upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}