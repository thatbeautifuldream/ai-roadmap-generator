"use client";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function Login({
  searchParams,
}: {
  searchParams: { [callbackUrl: string]: string };
}) {
  const callbackUrl = searchParams.callbackUrl;
  return (
    <Button
      onClick={() =>
        signIn("github", {
          callbackUrl: callbackUrl || "/",
        })
      }
    >
      Login using Github
    </Button>
  );
}
