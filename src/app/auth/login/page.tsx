"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

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
    <Button
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      onClick={() => handleLogin("google")}
    >
      Login using Google
    </Button>
  );
}
