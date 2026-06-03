import axios from "axios";

const API = "/api/users";

export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API}/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API}/login`, {
    email,
    password,
  });
  return response.data;
};

export const saveToken = (token, name, email) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user_name", name);
  localStorage.setItem("user_email", email);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  return {
    name: localStorage.getItem("user_name"),
    email: localStorage.getItem("user_email"),
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_email");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};