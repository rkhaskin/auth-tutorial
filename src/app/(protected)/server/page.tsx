import React from "react";
import { currentUser } from "@/lib/current-user";
import { UserInfo } from "@/components/user-info";

export default async function ServerPage() {
  const user = await currentUser();

  return <UserInfo user={user} label="💻Server Component" />;
}
