import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'http://localhost:8080/api/languages/'
export default class LanguageService {
  getLanguagesByResumeId = (resumeId) => {
    return axios.get(API_URL + `getLanguagesByResumeId/${resumeId}`, {
      headers: authHeader(),
    })
  }

  getLanguageById = (languageId) => {
    return axios.get(API_URL + `getLanguageById/${languageId}`, {
      headers: authHeader(),
    })
  }

  addLanguage(values) {
    return axios.post(API_URL + 'add', values, {
      headers: authHeader(),
    })
  }

  updateLanguage(values) {
    return axios.put(API_URL + `edit/${values.languageId}`, values, {
      headers: authHeader(),
    })
  }

  deleteLanguage(languageId) {
    return axios.delete(API_URL + `deleteByLanguageId/${languageId}`, {
      headers: authHeader(),
    })
  }
}
