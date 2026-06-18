import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "/api";

const http = axios.create({
  baseURL,
  timeout: 90000,
  headers: {
    "Content-Type": "application/json"
  }
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("gotrippy_partner_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiError = (error) => {
  if (error?.code === "ECONNABORTED") {
    return "The server is taking too long to respond. Render may still be waking up. Please try again in a minute.";
  }

  if (!error?.response && error?.message === "Network Error") {
    return "Could not reach the GoTrippy server. Please refresh and try again.";
  }

  const data = error?.response?.data;

  if (data?.errors?.length) {
    return data.errors.map((item) => item.message).join(", ");
  }

  return data?.message || error?.message || "Something went wrong";
};

export default http;
