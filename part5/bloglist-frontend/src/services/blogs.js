import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newBlog) => {
  const auth = {
    headers: { Authorization: token },
  };

  try {
    const resultBlog = await axios.post(
      baseUrl,
      newBlog,
      auth
    );

    return resultBlog.data;
  } catch (e) {
    console.error('Error from blog post: ', e);
  }
};

export default { getAll, setToken, create };
