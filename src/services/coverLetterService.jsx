import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'http://localhost:8080/api/coverLetter/'
export default class CoverLetterService {
  getLetters = () => {
    return axios.get(API_URL + 'getAllCoverLetters', { headers: authHeader() })
  }

  getLettersByEmployeeId = (employeeId) => {
    return axios.get(API_URL + `getCoverLettersByEmployeeId/${employeeId}`, {
      headers: authHeader(),
    })
  }

  getLetterById = (letterId) => {
    return axios.get(API_URL + `getCoverLetterById/${letterId}`, {
      headers: authHeader(),
    })
  }

  addLetter(values) {
    return axios.post(API_URL + 'add', values, {
      headers: authHeader(),
    })
  }

  updateLetter(values) {
    return axios.put(API_URL + `edit/${values.letterId}`, values, {
      headers: authHeader(),
    })
  }

  deleteLetter(letterId) {
    return axios.delete(API_URL + `deleteByCoverLetterId/${letterId}`, {
      headers: authHeader(),
    })
  }
}
