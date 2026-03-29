import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY!,
});

export async function uploadToIPFS(file: File): Promise<string> {
  const result = await pinata.upload.public.file(file);
  return result.cid;
}

export function getIPFSUrl(cid: string): string {
  return `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${cid}`;
}