import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmailPassword from "supertokens-web-js/recipe/emailpassword";
import { useSession } from "@web/auth/hooks/session/useSession";
import { CompassApi } from "@web/common/apis/compass.api";
import { ROOT_ROUTES } from "@web/common/constants/routes";
import { markPasswordUserAsAuthenticated } from "@web/common/utils/storage/auth-state.util";
import { AuthFormLayout } from "@web/views/Login/AuthFormLayout";

export const SignupView = () => {
  const navigate = useNavigate();
  const { setAuthenticated } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await EmailPassword.signUp({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password },
        ],
      });

      if (response.status === "FIELD_ERROR") {
        const fieldError = response.formFields.find(
          (f) => f.error !== undefined,
        );
        setError(fieldError?.error || "Please check your input");
        return;
      }

      if (response.status === "SIGN_UP_NOT_ALLOWED") {
        setError(
          "Sign up is not allowed. An account may already exist with this email.",
        );
        return;
      }

      if (response.status === "OK") {
        // After signup, store name in user metadata so it persists
        try {
          await CompassApi.post("/user/metadata", {
            firstName,
            lastName,
          });
        } catch {
          // Non-critical: name can be updated later
        }

        markPasswordUserAsAuthenticated();
        setAuthenticated(true);
        navigate(ROOT_ROUTES.VERIFY_EMAIL);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout title="Create your account">
      <form onSubmit={(e) => void handleSignup(e)} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label
              htmlFor="firstName"
              className="text-text-light mb-1 block text-sm font-medium"
            >
              First name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
              className="bg-bg-secondary text-text-lighter border-border-primary focus:border-accent-primary focus:ring-accent-primary w-full rounded-md border px-3 py-2 text-sm placeholder-gray-500 focus:ring-1 focus:outline-none"
              placeholder="First"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="lastName"
              className="text-text-light mb-1 block text-sm font-medium"
            >
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="family-name"
              className="bg-bg-secondary text-text-lighter border-border-primary focus:border-accent-primary focus:ring-accent-primary w-full rounded-md border px-3 py-2 text-sm placeholder-gray-500 focus:ring-1 focus:outline-none"
              placeholder="Last"
            />
          </div>
        </div>

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

        <div>
          <label
            htmlFor="password"
            className="text-text-light mb-1 block text-sm font-medium"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-text-light-inactive mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          to={ROOT_ROUTES.LOGIN}
          className="text-accent-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthFormLayout>
  );
};
