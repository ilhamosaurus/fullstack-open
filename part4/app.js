const express = require('express');
const app = express();
const cors = require('cors');
const { MONGO_URI } = require('./utils/config');
const mongoose = require('mongoose');
const { info, error } = require('./utils/logger');
const blogRouter = require('./controllers/blogRoute');
require('express-async-errors');
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middleware');
const userRouter = require('./controllers/userRoute');

mongoose.set('strictQuery', false);

const connectToMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    info('Connected to MongoDB');
  } catch (e) {
    error('Error connecting to MongoDB: ', e);
  }
};

connectToMongo();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(requestLogger);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
