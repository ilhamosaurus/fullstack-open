const User = require('../models/user');
const { info, error } = require('./logger');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const requestLogger = (req, res, next) => {
  info('Method: ', req.method);
  info('Path: ', req.path);
  info('Body: ', req.body);
  info('---');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  error(err.message);

  if (err.name === 'CastError') {
    return res
      .status(400)
      .send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'TokenExpiredError') {
    return res.status(400).json({ error: 'token expired' });
  }
  next(err);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');

  if (
    authorization &&
    authorization.startsWith('Bearer ')
  ) {
    req.token = authorization.replace('Bearer ', '');
    return next();
  }
  req.token = null;
  return next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    req.user = null;
  } else {
    const decodedToken = jwt.verify(
      req.token,
      process.env.SECRET
    );

    if (!decodedToken) {
      req.user = null;
    } else {
      req.user = await User.findById(decodedToken.id);
    }
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
