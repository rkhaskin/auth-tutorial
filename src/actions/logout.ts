"use server";

import signOut from "@/actions/signout";

export default async function logout() {
  await signOut();
}
