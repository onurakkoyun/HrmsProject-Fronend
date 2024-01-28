import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/favoriteJobPostings/";
export default class FavoriteJobPostingService {
  addFavoriteJobPosting(employeeId, jobPostingId) {
    return axios.post(
      API_URL + "add",
      {
        employeeId: employeeId,
        jobPostingId: jobPostingId,
      },
      {
        headers: authHeader(),
      }
    );
  }

  removeFavoriteJobPosting(employeeId, jobPostingId) {
    return axios.delete(API_URL + `delete/${employeeId}/${jobPostingId}`, {
      headers: authHeader(),
    });
  }

  getFavoriteJobPostingsByEmployeeId = (employeeId) => {
    return axios.get(
      API_URL + `getFavoriteJobPostingsByEmployeeId/${employeeId}`,
      {
        headers: authHeader(),
      }
    );
  };
}
