import { authClient } from "./auth-client";

export const getTokenFromClient = async (): Promise<string> => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Unable to retrieve authentication token.");
  }

  return data.token;
};
