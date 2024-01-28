import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/jobPostings/";
export default class JobPostingService {
  getJobPostings = () => {
    return axios.get(API_URL + "getalljobpostings", { headers: authHeader() });
  };

  getJobPostingsSortByDate = () => {
    return axios.get(API_URL + "getJobPostingsSortByDate", {
      headers: authHeader(),
    });
  };

  getJobPostingsSortByPublicationDate = () => {
    return axios.get(API_URL + "getAllJobPostingsByPublicationDate", {
      headers: authHeader(),
    });
  };

  getJobPostingById = (id) => {
    return axios.get(
      `http://localhost:8080/api/jobPostings/getJobPostingById/${id}`
    );
  };

  getJobPostingsByEmployerId = (id) => {
    return axios.get(
      `http://localhost:8080/api/jobPostings/getJobPostingsByEmployerId/${id}`,
      {
        headers: authHeader(),
      }
    );
  };

  addJobPosting(values) {
    return axios.post(API_URL + "add", values, {
      headers: authHeader(),
    });
  }

  updateJobPosting(values) {
    return axios.put(API_URL + `edit/${values.jobPostingId}`, values, {
      headers: authHeader(),
    });
  }

  deleteJobPosting(id) {
    return axios.delete(
      `http://localhost:8080/api/jobPostings/deleteByJobPostingId/${id}`,
      {
        headers: authHeader(),
      }
    );
  }
}
