import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import Input from './components/Input';
import BlogForm from './components/BlogForm';
import Toggelable from './components/Toggelable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [likes, setLikes] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [changeMessage, setChangeMessage] = useState(null);
  const alias = ['Username', 'Password'];

  useEffect(() => {
    async function getBlogs() {
      try {
        const blogs = await blogService.getAll();

        setBlogs(blogs);
      } catch (e) {
        setErrorMessage('Error at rendering blogs: ', e);
      }
    }
    getBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      'loggedBloglistUser'
    );

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (e) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const addBlog = async (event) => {
    event.preventDefault();
    const newBlog = {
      title: title,
      author: author,
      url: url,
      user: user.name,
      likes: likes,
    };

    try {
      const result = await blogService.create(newBlog);

      setBlogs(blogs.concat(result));
      setChangeMessage(
        `a new blog ${newBlog.title} by ${newBlog.user} added`
      );
      setTimeout(() => {
        setChangeMessage(null);
      }, 5000);
    } catch (e) {
      throw new Error(e.message);
    }
  };

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <Input
            value={username}
            name={alias[0]}
            setChange={({ target }) =>
              setUsername(target.value)
            }
          />
          <div>
            {alias[1]}:
            <input
              type='password'
              name={alias[1]}
              value={password}
              onChange={({ target }) =>
                setPassword(target.value)
              }
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={changeMessage} />
      <p>{user.name} logged in</p>
      <button type='submit' onClick={handleLogout}>
        logout
      </button>
      <Toggelable buttonLabel='New Blog' buttonLabel2='Cancel'>
      <BlogForm
        title={title}
        author={author}
        url={url}
        likes={likes}
        handleSubmit={addBlog}
        handleTitleChange={({ target }) =>
          setTitle(target.value)
        }
        handleAuthorChange={({ target }) =>
          setAuthor(target.value)
        }
        handleUrlChange={({ target }) =>
          setUrl(target.value)
        }
        handleLikesChange={({ target }) =>
          setLikes(target.value)
        }
      />
      </Toggelable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
