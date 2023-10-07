import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/auth/";

const register = (username, email, password) => {
  return axios.post(
    API_URL + "signup/user",
    {
      username,
      email,
      password,
    },
    { headers: authHeader() }
  );
};

const registerEmployee = (
  username,
  email,
  password,
  firstName,
  lastName,
  identityNumber,
  yearOfBirth
) => {
  return axios.post(
    API_URL + "signup/employee",
    {
      username,
      email,
      password,
      firstName,
      lastName,
      identityNumber,
      yearOfBirth,
    },
    { headers: authHeader() }
  );
};

const registerEmployer = (
  username,
  email,
  password,
  companyName,
  website,
  phoneNumber
) => {
  return axios.post(
    API_URL + "signup/employer",
    {
      username,
      email,
      password,
      companyName,
      website,
      phoneNumber,
    },
    { headers: authHeader() }
  );
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  login,
  logout,
  register,
  registerEmployee,
  registerEmployer,
  getCurrentUser,
};

export default AuthService;
