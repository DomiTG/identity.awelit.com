"use server";
//Needs to use 'use server' so we are sure this code runs on the server side only.
//This is important for security reasons, as we are dealing with sensitive information like tokens.
import axios from "axios";

export interface AwelitAuthUser {
  id: number;
  email_address: string;
  created_at: Date;
  updated_at: Date;
}

export interface AwelitAuthResponse {
  accessToken: string;
  user: AwelitAuthUser;
  time_took: number; // Time taken for the request in milliseconds
}

export interface AwelitUserListResponse {
  users: AwelitAuthUser[];
}

export const AWELIT_AUTH_URL = "https://identity.awelit.com/api";

export const refreshToken = async (
  refreshToken: string
): Promise<AwelitAuthResponse> => {
  if (!refreshToken) {
    throw new Error("No refresh token provided");
  }
  const startTime = Date.now();
  const response = await axios({
    url: `${AWELIT_AUTH_URL}/refresh`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  const { accessToken, user } = response.data;
  return { accessToken, user, time_took: Date.now() - startTime };
};

/*
 * List users from the Awelit Auth service.
 * This function retrieves a list of users from the Awelit Auth service.
 * It requires an access token for authentication.
 * @param accessToken - The access token for authentication.
 * @returns A promise that resolves to an object containing the list of users and the time taken
 * 
 * USES CLIENT SECRET
*/

export const listUsers = async (client_id: string, client_secret: string): Promise<AwelitUserListResponse> => {
  if (!client_id || !client_secret) {
    throw new Error("Client ID and secret must be provided");
  }
  const startTime = Date.now();
  const response = await axios({
    url: `${AWELIT_AUTH_URL}/users/list`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`,
    },
  });

  return { users: response.data.users };
};
