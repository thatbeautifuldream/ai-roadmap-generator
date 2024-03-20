"use client";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function Login({
  searchParams,
}: {
  searchParams: { [callbackUrl: string]: string };
}) {
  const callbackUrl = searchParams.callbackUrl;

  const handleLogin = (provider: "google") => {
    signIn(provider, {
      callbackUrl: callbackUrl || "/",
    });
  };
  return (
    <Button onClick={() => handleLogin("google")}>Login using Google</Button>
  );
}
