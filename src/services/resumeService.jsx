import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/resumes/";
export default class ResumeService {
  getResumes = () => {
    return axios.get(API_URL + "getallresumes", { headers: authHeader() });
  };

  getResumesByEmployeeId = (employeeId) => {
    return axios.get(
      `http://localhost:8080/api/resumes/getResumesByEmployeeId/${employeeId}`,
      {
        headers: authHeader(),
      }
    );
  };

  getResumeById = (resumeId) => {
    return axios.get(
      `http://localhost:8080/api/resumes/getResumeById/${resumeId}`,
      {
        headers: authHeader(),
      }
    );
  };

  addResume(values) {
    return axios.post(API_URL + "add", values, {
      headers: authHeader(),
    });
  }

  deleteResume(resumeId) {
    return axios.delete(
      `http://localhost:8080/api/resumes/deleteByResumeId/${resumeId}`,
      {
        headers: authHeader(),
      }
    );
  }
}
