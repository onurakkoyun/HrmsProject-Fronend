import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/educations/";
export default class EducationService {
  getEducations = () => {
    return axios.get(API_URL + "getalleducations", { headers: authHeader() });
  };

  getEducationsByResumeId = (resumeId) => {
    return axios.get(
      `http://localhost:8080/api/educations/getEducationsByResumeId/${resumeId}`,
      {
        headers: authHeader(),
      }
    );
  };

  getEducationById = (resumeId) => {
    return axios.get(
      `http://localhost:8080/api/experiences/getEducationById/${resumeId}`,
      {
        headers: authHeader(),
      }
    );
  };

  addEducation(values) {
    return axios.post(API_URL + "add", values, {
      headers: authHeader(),
    });
  }

  deleteEducation(educationId) {
    return axios.delete(
      `http://localhost:8080/api/educations/deleteByEducationId/${educationId}`,
      {
        headers: authHeader(),
      }
    );
  }
}
