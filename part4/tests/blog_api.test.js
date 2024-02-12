const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});

  const hash = await bcrypt.hash('supersecret', 10);
  const user = new User({
    username: 'test',
    name: 'testis',
    blogs: [],
    hash,
  });

  await user.save();
}, 100000);

beforeEach(async () => {
  await Blog.deleteMany({});

  const users = await User.find({});
  const user = users[0];

  const blogObject = helper.blogs.map(
    (blog) =>
      new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        user: user._id,
        likes: blog.likes ? blog.likes : 0,
      })
  );
  const promiseArray = blogObject.map((blog) => {
    blog.save();
    user.blogs = user.blogs.concat(blog._id);
  });
  await Promise.all(promiseArray);
  await user.save();
}, 100000);

describe('When there is initially blogs are saved', () => {
  test('blogs are return as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.blogs.length);
  });

  test('The unique identifier property of the blog posts is named id', async () => {
    const startingBlogs = await helper.blogsInDb();

    const blogToLook = startingBlogs[0];

    const result = await api
      .get(`/api/blogs/${blogToLook.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result).toBeDefined();
  });
});

describe('look for a specific blog', () => {
  test('A valid blog can be added', async () => {
    const user = {
      username: 'test',
      password: 'supersecret',
    };
    const loginUser = await api
      .post('/api/login')
      .send(user);

    const newBlog = {
      title: 'Kisah 2 anak yatim',
      author: 'Ilhamosaurus',
      url: 'https://github.com/ilhamosaurus/nothingtoseehere',
      likes: 300,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(
        'Authorization',
        `Bearer ${loginUser.body.token}`
      )
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newBlogPost = await helper.blogsInDb();

    expect(newBlogPost).toHaveLength(
      helper.blogs.length + 1
    );

    const titles = newBlogPost.map((n) => n.title);

    expect(titles).toContain('Kisah 2 anak yatim');
  }, 100000);

  test('A blog cannot be added by unauthorized users', async () => {
    const newBlog = {
      title: 'Kisah 2 anak yatim',
      author: 'Ilhamosaurus',
      url: 'https://github.com/ilhamosaurus/nothingtoseehere',
      likes: 300,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const newBlogPost = await helper.blogsInDb();

    expect(newBlogPost).toHaveLength(helper.blogs.length);

    const titles = newBlogPost.map((n) => n.title);

    expect(titles).not.toContain('Kisah 2 anak yatim');
  }, 100000);

  test('New blog without likes property will be set to 0 by default', async () => {
    const user = {
      username: 'test',
      password: 'supersecret',
    };
    const loginUser = await api
      .post('/api/login')
      .send(user);

    const newBlog = {
      title: 'Kisah 2 anak yatim',
      author: 'Ilhamosaurus2',
      url: 'https://github.com/ilhamosaurus/nothingtoseehere',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(
        'Authorization',
        `Bearer ${loginUser.body.token}`
      )
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newBlogPost = await helper.blogsInDb();

    expect(newBlogPost).toHaveLength(
      helper.blogs.length + 1
    );

    const sumLikes = newBlogPost.map((n) => n.likes);

    expect(sumLikes).toContain(0);
  });

  test('New blog without title will not be added', async () => {
    const user = {
      username: 'test',
      password: 'supersecret',
    };
    const loginUser = await api
      .post('/api/login')
      .send(user);

    const newBlog = {
      author: 'Ilhamosaurus2',
      url: 'https://github.com/ilhamosaurus/nothingtoseehere',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(
        'Authorization',
        `Bearer ${loginUser.body.token}`
      )
      .expect(400);

    const allBlogs = await helper.blogsInDb();

    expect(allBlogs).toHaveLength(helper.blogs.length);
  });

  test('New blog without url will not be added', async () => {
    const user = {
      username: 'test',
      password: 'supersecret',
    };
    const loginUser = await api
      .post('/api/login')
      .send(user);

    const newBlog = {
      title: 'Kisah 2 anak yatim',
      author: 'Ilhamosaurus2',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(
        'Authorization',
        `Bearer ${loginUser.body.token}`
      )
      .expect(400);

    const allBlogs = await helper.blogsInDb();

    expect(allBlogs).toHaveLength(helper.blogs.length);
  });
});

describe('Deletion of a blog', () => {
  test('Try to delete a blog', async () => {
    const user = {
      username: 'test',
      password: 'supersecret',
    };
    const loginUser = await api
      .post('/api/login')
      .send(user);

    const startingBlog = await helper.blogsInDb();
    const blogToDelete = startingBlog[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(
        'Authorization',
        `Bearer ${loginUser.body.token}`
      )
      .expect(204);

    const resultBlog = await helper.blogsInDb();

    expect(resultBlog).toHaveLength(
      helper.blogs.length - 1
    );

    const allTitles = resultBlog.map((n) => n.title);

    expect(allTitles).not.toContain(blogToDelete.title);
  });
});

describe('Update a blog', () => {
  test('An information of an individual blog post is updated', async () => {
    const startingBlog = await helper.blogsInDb();

    const { id, author, url } = startingBlog[0];

    const newData = {
      title: 'Ilham ganteng',
      author,
      url,
      likes: 200000,
    };

    await api
      .put(`/api/blogs/${id}`)
      .send(newData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const resultBlogs = await helper.blogsInDb();

    expect(resultBlogs).toHaveLength(startingBlog.length);

    const lastTitles = startingBlog.map((n) => n.title);
    const updatedTitles = resultBlogs.map((n) => n.title);

    expect(updatedTitles).not.toContain(lastTitles);

    const lastLikes = startingBlog.map((n) => n.likes);
    const updatedLikes = resultBlogs.map((n) => n.likes);

    expect(updatedLikes).not.toContain(lastLikes);
  });
});

describe('When there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const hash = await bcrypt.hash('supersecret', 10);
    const user = new User({ username: 'root', hash });

    await user.save();
  });

  test('Creation succeeds with a fresh username', async () => {
    const startingUsers = await helper.usersInDb();

    const newUser = {
      username: 'ilhamosaurus',
      name: 'ilham aja',
      password: 'supersecret',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect('Content-Type', /application\/json/);

    const resultUsers = await helper.usersInDb();
    expect(resultUsers).toHaveLength(
      startingUsers.length + 1
    );

    const usernames = resultUsers.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('Creation fails with proper status code and message if username already taken', async () => {
    const startingUser = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'expected `username` to be unique'
    );

    const resultUsers = await helper.usersInDb();
    expect(resultUsers).toEqual(startingUser);
  });

  test('Creation fails with proper statuscode and message if username did not exist', async () => {
    const startingUsers = await helper.usersInDb();

    const newUser = {
      name: 'testing',
      password: 'testis',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'password and username must be filled'
    );

    const resultUser = await helper.usersInDb();
    expect(resultUser).toEqual(startingUsers);
  });

  test('Creation fails with proper statuscode and message if password doesnot exist', async () => {
    const startingUsers = await helper.usersInDb();

    const newUser = {
      username: 'test',
      name: 'testing',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'password and username must be filled'
    );

    const resultUser = await helper.usersInDb();
    expect(resultUser).toEqual(startingUsers);
  });

  test('creation fails with proper statuscode and message if username is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ro',
      name: 'testis',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'password and username must be 4 or more characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if password is less than three characters', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'kakakaka',
      name: 'testis',
      password: 'sa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'password and username must be 4 or more characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});
