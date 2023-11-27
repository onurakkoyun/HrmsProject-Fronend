import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/employers/";
export default class EmployerService {
  getEmployerById = (id) => {
    return axios.get(API_URL + `getEmployerById/${id}`, {
      headers: authHeader(),
    });
  };

  updateProfile(values) {
    return axios.put(API_URL + `edit/${values.id}`, values, {
      headers: authHeader(),
    });
  }
}
