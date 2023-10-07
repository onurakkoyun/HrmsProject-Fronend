import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/workingTypes/";
export default class WorkingTypeService {
  getWorkingTypes = () => {
    return axios.get(API_URL + "getall", { headers: authHeader() });
  };
}
