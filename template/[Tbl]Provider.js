import axios from 'axios'
import AppConfig from '@/AppConfig'

export default {
  url: AppConfig.services.api,
  async find(where, opts = { page: 1, recordsPerPage: 20 }) {
    const rs = await axios.get(`${this.url}/${tbl}`, {
      params: opts
    })
    return rs.data
  },
  async get(item) {
    const rs = await axios.get(`${this.url}/${tbl}/${item._id}`, item)
    return rs.data
  },
  async insert(item) {
    const rs = await axios.post(`${this.url}/${tbl}`, item)
    return rs.data
  },
  async update(item) {
    const rs = axios.put(`${this.url}/${tbl}/${item._id}`, item)
    return rs.data
  },
  async delete(_id) {
    await axios.delete(`${this.url}/${tbl}/${_id}`)
  }
}
