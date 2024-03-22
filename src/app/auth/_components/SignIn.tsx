import React from "react";
import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <div className="relative mb-8">
          <Link className="text-3xl font-bold mr-4" href="/">
            RoadmapAI
          </Link>
          <span className="top-[34px] absolute right-[70px] items-center rounded-md bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
            BETA
          </span>
        </div>

        <h1 className="text-xl text-gray-800 font-semibold tracking-tighter">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-600 max-w-xs mx-auto">
          By continuing, you are setting up for a RoadmapAI account and agree to
          our User Agreement and Privacy Policy
        </p>

        {/* SignIn Button */}
        <UserAuthForm />
      </div>
    </div>
  );
};

export default SignIn;
