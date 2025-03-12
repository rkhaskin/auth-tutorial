import { auth } from "@/auth";

import React from "react";
import signOut from "@/actions/signout";

export default async function Settings() {
  // this session comes from auth::callbacks::session
  const session = await auth();
  return (
    <div>
      {JSON.stringify(session)}
      <form action={signOut}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}
