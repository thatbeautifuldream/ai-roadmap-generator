import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout(props: Props) {
  const { children } = props;
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {children}
    </div>
  );
}
