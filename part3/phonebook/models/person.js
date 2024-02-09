require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const url = process.env.MONGO_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to mongodb');
  })
  .catch((err) => {
    console.error('The error was: ', err);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{7,}/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number`,
    },
    minLength: 8,
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id =
      returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model(
  'Person',
  personSchema
);
