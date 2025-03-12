import { fileLogger } from "@/logger/logger";

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { msg, date } = body;

  fileLogger.info(`${date} - ${msg}`);

  return Response.json({}, { status: 201 });
}
