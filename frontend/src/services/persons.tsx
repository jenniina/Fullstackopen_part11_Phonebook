import axios from 'axios'
import { person } from '../interfaces'

const VITE_BASE_URI = import.meta.env.VITE_BASE_URI
const baseUrl = VITE_BASE_URI ? `${VITE_BASE_URI}/api/persons` : '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = (newObject: person) => {
  const request = axios.post(baseUrl, newObject)
  return request.then((response) => response.data)
}

const update = (id: number | undefined, newObject: person) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then((response) => response.data)
}
const remove = (id: number | undefined) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then((response) => response.data)
}

export default { getAll, create, update, remove }
