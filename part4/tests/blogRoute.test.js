const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObject = helper.blogs.map(
    (blog) => new Blog(blog)
  );
  const promiseArray = blogObject.map((blog) =>
    blog.save()
  );
  await Promise.all(promiseArray);
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
    const newBlog = {
      title: 'Kisah 2 anak yatim',
      author: 'Ilhamosaurus',
      url: 'https://github.com/ilhamosaurus/nothingtoseehere',
      likes: 300,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newBlogPost = await helper.blogsInDb();

    expect(newBlogPost).toHaveLength(
      helper.blogs.length + 1
    );

    const titles = newBlogPost.map((n) => n.title);

    expect(titles).toContain('Kisah 2 anak yatim');
  }, 100000);

  test('New blog without likes property will be set to 0 by default', async () => {
    const newBlog = {
      title: 'Kisah 2 anak yatim',
      author: 'Ilhamosaurus2',
      url: 'https://github.com/ilhamosaurus/nothingtoseehere',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
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
    const newBlog = {
      author: 'Ilhamosaurus2',
      url: 'https://github.com/ilhamosaurus/nothingtoseehere',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const allBlogs = await helper.blogsInDb();

    expect(allBlogs).toHaveLength(helper.blogs.length);
  });

  test('New blog without url will not be added', async () => {
    const newBlog = {
      title: 'Kisah 2 anak yatim',
      author: 'Ilhamosaurus2',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const allBlogs = await helper.blogsInDb();

    expect(allBlogs).toHaveLength(helper.blogs.length);
  });
});

describe('Deletion of a blog', () => {
  test('Try to delete a blog', async () => {
    const startingBlog = await helper.blogsInDb();
    const blogToDelete = startingBlog[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
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
afterAll(async () => {
  await mongoose.connection.close();
});
