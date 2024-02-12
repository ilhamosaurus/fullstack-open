const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    hash,
  });

  const newUser = await user.save();

  res.status(201).json(newUser);
});

module.exports = userRouter;
