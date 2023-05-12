import axios from 'axios'
import { newUser, user } from '../interfaces'

const VITE_BASE_URI = import.meta.env.VITE_BASE_URI
const baseUrl = VITE_BASE_URI ? `${VITE_BASE_URI}/api/users` : '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNewUser = async (newUser: newUser) => {
  const response = await axios.post(baseUrl, newUser)
  return response.data
}

const deleteUser = async (id: user['id']) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default { getAll, createNewUser, deleteUser }
