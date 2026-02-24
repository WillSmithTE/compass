import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmailPassword from "supertokens-web-js/recipe/emailpassword";
import { useGoogleAuth } from "@web/auth/hooks/oauth/useGoogleAuth";
import { useSession } from "@web/auth/hooks/session/useSession";
import { ROOT_ROUTES } from "@web/common/constants/routes";
import { markPasswordUserAsAuthenticated } from "@web/common/utils/storage/auth-state.util";
import { GoogleButton } from "@web/components/oauth/google/GoogleButton";
import { AuthFormLayout } from "@web/views/Login/AuthFormLayout";

export const LoginView = () => {
  const navigate = useNavigate();
  const { setAuthenticated } = useSession();
  const { login: googleLogin } = useGoogleAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await EmailPassword.signIn({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password },
        ],
      });

      if (response.status === "FIELD_ERROR") {
        const fieldError = response.formFields.find(
          (f) => f.error !== undefined,
        );
        setError(fieldError?.error || "Invalid email or password");
        return;
      }

      if (response.status === "WRONG_CREDENTIALS_ERROR") {
        setError("Invalid email or password");
        return;
      }

      if (response.status === "SIGN_IN_NOT_ALLOWED") {
        setError("Sign in is not allowed. Please verify your email first.");
        return;
      }

      if (response.status === "OK") {
        markPasswordUserAsAuthenticated();
        setAuthenticated(true);
        navigate(ROOT_ROUTES.DAY);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout title="Welcome back">
      <form onSubmit={(e) => void handlePasswordLogin(e)} className="space-y-4">
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
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-text-light block text-sm font-medium"
            >
              Password
            </label>
            <Link
              to={ROOT_ROUTES.FORGOT_PASSWORD}
              className="text-accent-primary text-xs hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="bg-bg-secondary text-text-lighter border-border-primary focus:border-accent-primary focus:ring-accent-primary w-full rounded-md border px-3 py-2 text-sm placeholder-gray-500 focus:ring-1 focus:outline-none"
            placeholder="Enter your password"
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
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <div className="bg-border-primary h-px flex-1" />
        <span className="text-text-light-inactive text-xs">or</span>
        <div className="bg-border-primary h-px flex-1" />
      </div>

      <div className="flex justify-center">
        <GoogleButton
          onClick={() => googleLogin()}
          label="Sign in with Google"
        />
      </div>

      <p className="text-text-light-inactive mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          to={ROOT_ROUTES.SIGNUP}
          className="text-accent-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </AuthFormLayout>
  );
};
