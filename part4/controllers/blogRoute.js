const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const { error } = require('../utils/logger');

blogRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({});

    res.json(blogs);
  } catch (e) {
    error('Error getting blogs: ', e);
  }
});

blogRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body;
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes ? likes : 0,
  });

  if (!title || !url) {
    return res.status(400).end();
  }

  try {
    const result = await blog.save();

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
      { title, author, url, likes },
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    );

    res.json(updatedBlog);
  } catch (e) {
    error('Error updating blog: ', e);
  }
});

blogRouter.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    res.status(204).end();
  } catch (e) {
    error('Error deleting a blog: ', e);
  }
});

module.exports = blogRouter;
