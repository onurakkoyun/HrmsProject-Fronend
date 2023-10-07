import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/experiences/";
export default class ExperienceService {
  getExperiences = () => {
    return axios.get(API_URL + "getallexperiences", { headers: authHeader() });
  };

  getExperiencesByResumeId = (resumeId) => {
    return axios.get(
      `http://localhost:8080/api/experiences/getExperiencesByResumeId/${resumeId}`,
      {
        headers: authHeader(),
      }
    );
  };

  getExperienceById = (experienceId) => {
    return axios.get(
      `http://localhost:8080/api/experiences/getExperienceById/${experienceId}`,
      {
        headers: authHeader(),
      }
    );
  };

  addExperience(values) {
    return axios.post(API_URL + "add", values, {
      headers: authHeader(),
    });
  }

  deleteExperience(experienceId) {
    return axios.delete(
      `http://localhost:8080/api/experiences/deleteByExperienceId/${experienceId}`,
      {
        headers: authHeader(),
      }
    );
  }
}
