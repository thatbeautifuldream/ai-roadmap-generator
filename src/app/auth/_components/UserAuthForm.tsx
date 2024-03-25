"use client";
import { Icons } from "@/app/shared/Icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface UserAuthFormProps {
  className?: string;
}

const UserAuthForm = ({ className }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      toast.error("There was a problem", {
        description:
          "There was an error logging you in. Please try again later",
        duration: 4000,
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
        {isLoading ? null : (
          <div className="grayscale">
            <Icons.google className="h-4 w-4 mr-2" />
          </div>
        )}
        Login using Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
