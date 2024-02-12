const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!password || !username) {
    return res
      .status(400)
      .json({
        error: 'password and username must be filled',
      });
  } else if (password.length < 3 || username.length < 3) {
    return res
      .status(400)
      .json({
        error:
          'password and username must be 4 or more characters long',
      });
  } else {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      hash,
    });

    const newUser = await user.save();

    res.status(201).json(newUser);
  }
});

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    likes: 1,
  });

  res.json(users);
});

module.exports = userRouter;
