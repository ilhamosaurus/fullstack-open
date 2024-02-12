const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const { error } = require('../utils/logger');

blogRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });

    res.json(blogs);
  } catch (e) {
    error('Error getting blogs: ', e);
  }
});

blogRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body;

  const user = req.user;

  if (!user) {
    return res
      .status(401)
      .json({ error: 'token missing or invalid' });
  }
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes ? likes : 0,
    user: user.id,
  });

  if (!title || !url) {
    return res.status(400).end();
  }

  try {
    const result = await blog.save();

    user.blogs = user.blogs.concat(result._id);
    await user.save();

    return res.status(201).json(result);
  } catch (e) {
    error('Error saving up a blog: ', e);
  }
});

blogRouter.get('/:id', async (req, res) => {
  try {
    const blogById = await Blog.findById(req.params.id);

    if (!blogById) {
      return res.status(404).end();
    }

    return res.json(blogById);
  } catch (e) {
    error('Error getting blog by id: ', e);
  }
});

blogRouter.put('/:id', async (req, res) => {
  try {
    const { title, author, url, likes } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, author, url, likes: likes ? likes : 0 },
      {
        new: true,
      }
    );

    res.json(updatedBlog);
  } catch (e) {
    error('Error updating blog: ', e);
  }
});

blogRouter.delete('/:id', async (req, res) => {
  const user = req.user;

  if (!user) {
    return res
      .status(401)
      .json({ error: 'token missing or invalid' });
  }

  try {
    const blog = await Blog.findById(req.params.id);

    if (blog.user.toString() === user.id) {
      await Blog.findByIdAndDelete(req.params.id);

      return res.status(204).end();
    } else {
      return res
        .status(401)
        .json({ error: 'Unauthorized to delete the blog' });
    }
  } catch (e) {
    error('Error deleting a blog: ', e);
  }
});

module.exports = blogRouter;
