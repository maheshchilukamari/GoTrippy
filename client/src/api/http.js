import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "/api";

const http = axios.create({
  baseURL,
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
  const data = error?.response?.data;

  if (data?.errors?.length) {
    return data.errors.map((item) => item.message).join(", ");
  }

  return data?.message || error?.message || "Something went wrong";
};

export default http;
