import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/resumes/";
export default class ResumeService {
  getResumes = () => {
    return axios.get(API_URL + "getallresumes", { headers: authHeader() });
  };

  getResumesByEmployeeId = (employeeId) => {
    return axios.get(API_URL + `getResumesByEmployeeId/${employeeId}`, {
      headers: authHeader(),
    });
  };

  getResumeById = (resumeId) => {
    return axios.get(API_URL + `getResumeById/${resumeId}`, {
      headers: authHeader(),
    });
  };

  addResume(values) {
    return axios.post(API_URL + "add", values, {
      headers: authHeader(),
    });
  }

  updateResume(values) {
    return axios.put(API_URL + `edit/${values.resumeId}`, values, {
      headers: authHeader(),
    });
  }

  deleteResume(resumeId) {
    return axios.delete(API_URL + `deleteByResumeId/${resumeId}`, {
      headers: authHeader(),
    });
  }
}
