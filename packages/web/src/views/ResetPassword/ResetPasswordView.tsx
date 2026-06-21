import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import EmailPassword from "supertokens-web-js/recipe/emailpassword";
import { ROOT_ROUTES } from "@web/common/constants/routes";
import { AuthFormLayout } from "@web/views/Login/AuthFormLayout";

export const ResetPasswordView = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <AuthFormLayout title="Invalid link">
        <p className="text-text-light text-center text-sm">
          This password reset link is invalid or has expired.
        </p>
        <p className="text-text-light-inactive mt-4 text-center text-sm">
          <Link
            to={ROOT_ROUTES.FORGOT_PASSWORD}
            className="text-accent-primary hover:underline"
          >
            Request a new reset link
          </Link>
        </p>
      </AuthFormLayout>
    );
  }

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await EmailPassword.submitNewPassword({
        formFields: [{ id: "password", value: newPassword }],
      });

      if (response.status === "FIELD_ERROR") {
        const fieldError = response.formFields.find(
          (f) => f.error !== undefined,
        );
        setError(fieldError?.error || "Please enter a valid password");
        return;
      }

      if (response.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR") {
        setError("This reset link has expired. Please request a new one.");
        return;
      }

      if (response.status === "OK") {
        setIsReset(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isReset) {
    return (
      <AuthFormLayout title="Password updated">
        <p className="text-text-light text-center text-sm">
          Your password has been reset successfully.
        </p>
        <Link
          to={ROOT_ROUTES.LOGIN}
          className="bg-accent-primary hover:bg-accent-primary/90 mt-4 block w-full rounded-md px-4 py-2 text-center text-sm font-medium text-white transition-colors"
        >
          Sign in
        </Link>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout title="Set new password">
      <form onSubmit={(e) => void handleReset(e)} className="space-y-4">
        <div>
          <label
            htmlFor="newPassword"
            className="text-text-light mb-1 block text-sm font-medium"
          >
            New password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="bg-bg-secondary text-text-lighter border-border-primary focus:border-accent-primary focus:ring-accent-primary w-full rounded-md border px-3 py-2 text-sm placeholder-gray-500 focus:ring-1 focus:outline-none"
            placeholder="At least 8 characters"
          />
          <p className="text-text-light-inactive mt-1 text-xs">
            Must be at least 8 characters
          </p>
        </div>

        {error && (
          <p className="text-status-error text-sm" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-accent-primary hover:bg-accent-primary/90 w-full rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
        >
          {isLoading ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </AuthFormLayout>
  );
};
