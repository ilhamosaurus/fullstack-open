import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newBlog) => {
  const auth = {
    headers: { Authorization: token },
  }

  try {
    const resultBlog = await axios.post(baseUrl, newBlog, auth)

    return resultBlog.data
  } catch (e) {
    console.error('Error from blog post: ', e)
  }
}

const update = async (id, updatedBlog) => {
  try {
    const result = await axios.put(`${baseUrl}/${id}`, updatedBlog)

    return result.data
  } catch (e) {
    console.error('Error from blog update: ', e)
  }
}

const remove = async (id) => {
  const auth = {
    headers: { Authorization: token },
  }

  try {
    const result = await axios.delete(`${baseUrl}/${id}`, auth)

    return result.data
  } catch (e) {
    console.error('Error from deleting blog: ', e)
  }
}

export default { getAll, setToken, create, update, remove }
