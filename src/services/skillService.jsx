import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'http://localhost:8080/api/skills/'
export default class SkillService {
  getSkillsByResumeId = (resumeId) => {
    return axios.get(API_URL + `getSkillsByResumeId/${resumeId}`, {
      headers: authHeader(),
    })
  }

  getSkillById = (skillId) => {
    return axios.get(API_URL + `getSkillById/${skillId}`, {
      headers: authHeader(),
    })
  }

  addSkill(values) {
    return axios.post(API_URL + 'add', values, {
      headers: authHeader(),
    })
  }

  updateSkill(values) {
    return axios.put(API_URL + `edit/${values.skillId}`, values, {
      headers: authHeader(),
    })
  }

  deleteSkill(skillId) {
    return axios.delete(API_URL + `deleteBySkillId/${skillId}`, {
      headers: authHeader(),
    })
  }
}
