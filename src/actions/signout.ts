"use server";

import * as auth from "@/auth";
import { postLog } from "@/logger/logWrapper";

export default async function signOut() {
  await postLog("actions::signout");

  return auth.signOut();
}
