import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import { ROOT_ROUTES } from "@web/common/constants/routes";
import { AuthFormLayout } from "@web/views/Login/AuthFormLayout";

export const VerifyEmailView = () => {
  const [searchParams] = useSearchParams();
  const hasToken = searchParams.has("token");

  const [status, setStatus] = useState<
    "checking" | "verified" | "pending" | "error" | "already-verified"
  >(hasToken ? "checking" : "pending");
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const verifyToken = useCallback(async () => {
    try {
      const response = await EmailVerification.verifyEmail();

      if (response.status === "OK") {
        setStatus("verified");
      } else if (response.status === "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR") {
        setError("This verification link has expired or is invalid.");
        setStatus("error");
      }
    } catch {
      setError("Something went wrong during verification.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (hasToken) {
      void verifyToken();
    } else {
      // Check if email is already verified
      void EmailVerification.isEmailVerified()
        .then((result) => {
          if (result.isVerified) {
            setStatus("already-verified");
          }
        })
        .catch(() => {
          // If check fails, just show the pending state
        });
    }
  }, [hasToken, verifyToken]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setError(null);

    try {
      const response = await EmailVerification.sendVerificationEmail();
      if (response.status === "OK") {
        setError(null);
        alert("Verification email sent! Check your inbox.");
      } else if (response.status === "EMAIL_ALREADY_VERIFIED_ERROR") {
        setStatus("already-verified");
      }
    } catch {
      setError("Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  if (status === "checking") {
    return (
      <AuthFormLayout title="Verifying your email...">
        <div className="flex justify-center">
          <div
            className="border-border-primary border-t-accent-primary h-8 w-8 animate-spin rounded-full border-2"
            aria-label="Loading"
          />
        </div>
      </AuthFormLayout>
    );
  }

  if (status === "verified" || status === "already-verified") {
    return (
      <AuthFormLayout title="Email verified">
        <p className="text-text-light text-center text-sm">
          {status === "already-verified"
            ? "Your email is already verified."
            : "Your email has been verified successfully."}
        </p>
        <Link
          to={ROOT_ROUTES.DAY}
          className="bg-accent-primary hover:bg-accent-primary/90 mt-4 block w-full rounded-md px-4 py-2 text-center text-sm font-medium text-white transition-colors"
        >
          Go to app
        </Link>
      </AuthFormLayout>
    );
  }

  if (status === "error") {
    return (
      <AuthFormLayout title="Verification failed">
        <p className="text-status-error text-center text-sm">
          {error || "Something went wrong."}
        </p>
        <button
          onClick={() => void handleResendEmail()}
          disabled={isResending}
          className="bg-accent-primary hover:bg-accent-primary/90 mt-4 w-full rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
        >
          {isResending ? "Sending..." : "Resend verification email"}
        </button>
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

  // Pending state - user signed up but hasn't verified yet
  return (
    <AuthFormLayout title="Verify your email">
      <p className="text-text-light text-center text-sm">
        We sent a verification email to your inbox. Please click the link in the
        email to verify your account.
      </p>

      <button
        onClick={() => void handleResendEmail()}
        disabled={isResending}
        className="bg-accent-primary hover:bg-accent-primary/90 mt-4 w-full rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
      >
        {isResending ? "Sending..." : "Resend verification email"}
      </button>

      {error && (
        <p className="text-status-error mt-2 text-center text-sm" role="alert">
          {error}
        </p>
      )}

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
};
