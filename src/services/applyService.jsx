import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'http://localhost:8080/api/jobPostingApplications/'
export default class ApplyService {
  getAllApplication = () => {
    return axios.get(API_URL + 'getall', { headers: authHeader() })
  }

  getApplicationById = (applicationId) => {
    return axios.get(API_URL + `getApplicationById/${applicationId}`, {
      headers: authHeader(),
    })
  }

  getApplicationsByEmployeeId = (employeeId) => {
    return axios.get(API_URL + `getWithEmployeeId/${employeeId}`, {
      headers: authHeader(),
    })
  }

  getApplicationsByJobPostingId = (id) => {
    return axios.get(API_URL + `getWithJobPostingId/${id}`, {
      headers: authHeader(),
    })
  }

  addApplication(values) {
    return axios.post(API_URL + 'add', values, {
      headers: authHeader(),
    })
  }

  deleteApplication(applicationId) {
    return axios.delete(API_URL + `deleteById/${applicationId}`, {
      headers: authHeader(),
    })
  }
}
