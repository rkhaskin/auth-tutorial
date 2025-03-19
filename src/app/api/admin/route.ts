import { NextResponse } from "next/server";
import { currentUserRole } from "@/lib/current-user";
import { UserRole } from "@prisma/client";
//import { consoleLogger } from "@/logger/logger";

export async function GET() {
  const role = await currentUserRole();

  if (role === UserRole.Admin) {
    return new NextResponse(null, { status: 200 });
  }

  return new NextResponse(null, { status: 403 });
}
