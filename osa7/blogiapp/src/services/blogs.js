import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async (newObject) => {
  console.log('newObjectCreate',newObject)
  console.log('token',token)
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const addComment = async (newObject) => {
  console.log('newobject',newObject)
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(`${baseUrl}/${newObject.id}/comments`, newObject, config)
  return response.data
}

const update = async (newObject) => {
  console.log('newobj',newObject)
  const config = {
    headers: { Authorization: token },
  }
  console.log('token',token)
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject, config)
  console.log('updateresp',response)
  return response.data
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

export default { getAll, create, update, addComment, setToken, remove, getById }
