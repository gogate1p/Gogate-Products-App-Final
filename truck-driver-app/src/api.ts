import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://10.0.2.2:3000";

export const api =
  axios.create({
    baseURL:
      API_URL,

    timeout:
      30000,

    headers: {
      Accept:
        "application/json",

      "Content-Type":
        "application/json"
    }
  });

api.interceptors.request.use(
  async config => {

    const token =
      await SecureStore.getItemAsync(
        "truck_driver_token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  response =>
    response,

  async error => {

    if (
      error?.response?.status ===
      401
    ) {
      await SecureStore.deleteItemAsync(
        "truck_driver_token"
      );
    }

    return Promise.reject(
      error
    );
  }
);

export async function saveToken(
  token: string
) {
  await SecureStore.setItemAsync(
    "truck_driver_token",
    token
  );
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(
    "truck_driver_token"
  );
}

export async function getToken() {
  return SecureStore.getItemAsync(
    "truck_driver_token"
  );
}