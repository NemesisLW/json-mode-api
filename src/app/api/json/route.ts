import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  // Unstructred Data Input - JSON Output Format

  return new Response(JSON.stringify({ message: "Hello World" }));
};
