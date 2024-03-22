"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Icons } from "./Icons";

interface UserAuthFormProps {
  className?: string;
}

const UserAuthForm = ({ className }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast.error("There was a problem", {
        description:
          "There was an error logging you in. Please try again later",
        duration: 4000,
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)}>
      <Button
        size="sm"
        className="w-full"
        onClick={loginWithGoogle}
        disabled={isLoading}
        isLoading={isLoading}
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Login using Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
