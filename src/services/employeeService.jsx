import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/employees/";
export default class EmployeeService {
  getEmployeeById = (id) => {
    return axios.get(
      `http://localhost:8080/api/employees/getEmployeeById/${id}`,
      {
        headers: authHeader(),
      }
    );
  };
}
