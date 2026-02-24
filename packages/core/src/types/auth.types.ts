import { Credentials, TokenPayload } from "google-auth-library";
import type { User } from "supertokens-node";

export interface Result_Auth_Compass {
  status: "OK";
  createdNewRecipeUser: boolean;
  user: User;
}

export interface UserInfo_Google {
  gUser: TokenPayload;
  tokens: Credentials;
}

export interface PasswordSignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface PasswordSigninInput {
  email: string;
  password: string;
}

export interface PasswordResetRequestInput {
  email: string;
}

export interface PasswordResetInput {
  token: string;
  newPassword: string;
}
