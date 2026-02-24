import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import EmailPassword from "supertokens-web-js/recipe/emailpassword";
import { ROOT_ROUTES } from "@web/common/constants/routes";
import { AuthFormLayout } from "@web/views/Login/AuthFormLayout";

export const ForgotPasswordView = () => {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await EmailPassword.sendPasswordResetEmail({
        formFields: [{ id: "email", value: email }],
      });

      if (response.status === "FIELD_ERROR") {
        const fieldError = response.formFields.find(
          (f) => f.error !== undefined,
        );
        setError(fieldError?.error || "Please enter a valid email");
        return;
      }

      if (response.status === "PASSWORD_RESET_NOT_ALLOWED") {
        setError(
          "Password reset is not available for this account. You may have signed up with Google.",
        );
        return;
      }

      // Always show success to prevent email enumeration
      setIsSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <AuthFormLayout title="Check your email">
        <p className="text-text-light text-center text-sm">
          If an account exists with{" "}
          <span className="text-text-lighter font-medium">{email}</span>, we
          sent password reset instructions.
        </p>
        <p className="text-text-light-inactive mt-4 text-center text-sm">
          <Link
            to={ROOT_ROUTES.LOGIN}
            className="text-accent-primary hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout title="Reset your password">
      <p className="text-text-light-inactive mb-4 text-center text-sm">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="text-text-light mb-1 block text-sm font-medium"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="bg-bg-secondary text-text-lighter border-border-primary focus:border-accent-primary focus:ring-accent-primary w-full rounded-md border px-3 py-2 text-sm placeholder-gray-500 focus:ring-1 focus:outline-none"
            placeholder="you@example.com"
          />
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
          {isLoading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="text-text-light-inactive mt-6 text-center text-sm">
        <Link
          to={ROOT_ROUTES.LOGIN}
          className="text-accent-primary hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </AuthFormLayout>
  );
};
