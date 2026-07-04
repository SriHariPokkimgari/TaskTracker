import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.PUBLIC_API_URL}/api/auth`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const Login = async (formData) => {
  try {
    const res = await api.post("/login", formData);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to login";
    throw new Error(message);
  }
};

export const Signup = async (formData) => {
  try {
    const res = await api.post("/signup", formData);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to sign up";
    throw new Error(message);
  }
};

export const Logout = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const getMe = async () => {
  const res = await api.get("/me");
  return res.data;
};
