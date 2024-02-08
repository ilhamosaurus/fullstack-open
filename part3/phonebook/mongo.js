require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGO_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model(
  'Person',
  personSchema
);

if (process.argv.length === 2) {
  Person.find({}).then((result) => {
    console.log('phonebook: ');
    result.forEach((person) => {
      console.log(
        `${person.name} ${person.number}`
      );
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3],
  });

  person.save().then((result) => {
    console.log(
      `added ${result.name} number ${result.number} to phonebook`
    );
    mongoose.connection.close();
  });
}
