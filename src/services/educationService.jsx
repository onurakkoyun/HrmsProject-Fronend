import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'http://localhost:8080/api/educations/'
export default class EducationService {
  getEducations = () => {
    return axios.get(API_URL + 'getalleducations', { headers: authHeader() })
  }

  getEducationsByResumeId = (resumeId) => {
    return axios.get(API_URL + `getEducationsByResumeId/${resumeId}`, {
      headers: authHeader(),
    })
  }

  getEducationById = (educationId) => {
    return axios.get(API_URL + `getEducationById/${educationId}`, {
      headers: authHeader(),
    })
  }

  addEducation(values) {
    return axios.post(API_URL + 'add', values, {
      headers: authHeader(),
    })
  }

  updateEducation(values) {
    return axios.put(API_URL + `edit/${values.educationId}`, values, {
      headers: authHeader(),
    })
  }

  deleteEducation(educationId) {
    return axios.delete(
      `http://localhost:8080/api/educations/deleteByEducationId/${educationId}`,
      {
        headers: authHeader(),
      },
    )
  }
}
