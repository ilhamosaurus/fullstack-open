require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
const { error } = require('../utils/logger');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(password, user.hash);

    if (!(user && passwordCorrect)) {
      return res
        .status(401)
        .json({ error: 'invalid username or password' });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(
      userForToken,
      process.env.SECRET,
      { expiresIn: 15 * 60 }
    );

    res.status(200).send({
      token,
      username: user.username,
      name: user.name,
      id: user.id,
    });
  } catch (e) {
    error('Error when logining: ', e);
  }
});

module.exports = loginRouter;
