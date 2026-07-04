import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.PUBLIC_API_URL}/api/tasks`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const getTasks = async () => {
  const { data } = await api.get("/");
  return data;
};

export const createTask = async (taskData) => {
  try {
    const { data } = await api.post("/", taskData);
    return data;
  } catch (err) {
    const message =
      err.response?.data?.errors?.join(", ") ||
      err.response?.data?.message ||
      "Failed to create task";
    throw new Error(message);
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const { data } = await api.put(`/${id}`, taskData);
    return data;
  } catch (err) {
    const message =
      err.response?.data?.errors?.join(", ") ||
      err.response?.data?.message ||
      "Failed to update task";
    throw new Error(message);
  }
};

export const deleteTask = async (id) => {
  try {
    const { data } = await api.delete(`/${id}`);
    return data;
  } catch (err) {
    throw new Error("Failed to delete task");
  }
};
