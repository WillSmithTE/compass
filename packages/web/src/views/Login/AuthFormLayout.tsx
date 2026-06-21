import { ReactNode } from "react";

interface AuthFormLayoutProps {
  title: string;
  children: ReactNode;
}

export const AuthFormLayout = ({ title, children }: AuthFormLayoutProps) => {
  return (
    <div className="bg-bg-primary flex min-h-screen items-center justify-center">
      <div className="border-border-primary bg-bg-secondary w-full max-w-md rounded-xl border p-8 shadow-lg">
        <h1 className="text-text-lighter mb-6 text-center text-2xl font-semibold">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};
