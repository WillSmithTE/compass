import { TokenPayload } from "google-auth-library";
import { BaseError } from "@core/errors/errors.base";
import { Status } from "@core/errors/status.codes";
import { Schema_User } from "@core/types/user.types";

// Map  user object given by google signin to our schema //
export const mapUserToCompass = (
  gUser: TokenPayload,
  gRefreshToken: string,
): Schema_User => {
  if (!gUser.email || !gRefreshToken) {
    throw new BaseError(
      `Failed to Map Google User to Compass. \ngUser: ${JSON.stringify({
        ...gUser,
        gRefreshToken,
      })}`,
      "Missing Required GUser Field",
      Status.NOT_FOUND,
      true,
    );
  }

  return {
    email: gUser.email,
    name: gUser.name || "Mystery Person",
    firstName: gUser.given_name || "Mystery",
    lastName: gUser.family_name || "Person",
    locale: gUser.locale || "not provided",
    authProvider: "google" as const,
    google: {
      googleId: gUser.sub,
      picture: gUser.picture || "not provided",
      gRefreshToken,
    },
  };
};

export const mapPasswordUserToCompass = (
  email: string,
  firstName: string,
  lastName: string,
): Schema_User => {
  if (!email) {
    throw new BaseError(
      `Failed to create password user. Missing email.`,
      "Missing Required Field",
      Status.BAD_REQUEST,
      true,
    );
  }

  const name =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || lastName || email.split("@")[0] || "User";

  return {
    email,
    name,
    firstName: firstName || email.split("@")[0] || "User",
    lastName: lastName || "",
    locale: "not provided",
    authProvider: "password" as const,
  };
};
