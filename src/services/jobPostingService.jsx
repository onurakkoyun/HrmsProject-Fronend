import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/jobPostings/";
export default class JobPostingService {
  getJobPostingsSortByDate = () => {
    return axios.get(API_URL + "getJobPostingsSortByDate", {
      headers: authHeader(),
    });
  };

  getJobPostingById = (id) => {
    return axios.get(
      `http://localhost:8080/api/jobPostings/getJobPostingById/${id}`
    );
  };

  addJobPosting(values) {
    return axios.post(API_URL + "add", values, {
      headers: authHeader(),
    });
  }
}
