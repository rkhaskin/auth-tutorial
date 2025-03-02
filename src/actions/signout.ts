"use server";

import * as auth from "@/auth";

export default async function signOut() {
  return auth.signOut();
}
