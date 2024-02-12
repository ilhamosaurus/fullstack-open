const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(cors());
morgan.token('body', (request) =>
  JSON.stringify(request.body)
);
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('dist'));

// const MAX_RETRIES = 10; // Maximum number of attempts to find a unique ID

//saving up a good snippet
// const generateId = () => {
//   for (
//     let attempt = 0;
//     attempt < MAX_RETRIES;
//     attempt++
//   ) {
//     const newId = Math.random() * 10000;

//     if (
//       !persons.some(
//         (person) => person.id === newId
//       )
//     ) {
//       // Check for collision
//       return newId;
//     }
//   }
//   // If no unique ID found after retries, consider alternative strategies
//   throw new Error(
//     'Failed to generate unique ID after retries'
//   );
// };

const postMorgan = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
);

app.post(
  '/api/persons',
  postMorgan,
  async (req, res, next) => {
    const body = req.body;

    if (!body.name || !body.number) {
      return res.status(400).json({
        error: 'Please input all fields',
      });
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      });

      try {
        const newPerson = await person.save();

        res.json(newPerson);
      } catch (e) {
        next(e);
      }
    }
  }
);

app.get(
  '/api/persons',
  async (req, res, next) => {
    try {
      const result = await Person.find();

      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

app.get('/info', async (req, res, next) => {
  try {
    // Fetch the number of persons asynchronously
    const numPeople = await Person.countDocuments(
      {}
    );

    // Get the current UTC time (using async/await for consistency)
    const currentTime =
      await new Date().toUTCString();

    // Construct the response text efficiently
    const resText = `
      <p>Phonebook has info for ${numPeople} people</p>
      <br />
      <p>${currentTime}</p>
    `;

    // Send the response
    res.send(resText);
  } catch (error) {
    // Handle errors gracefully
    console.error('Error fetching info:', error);
    next(error); // Pass the error to the error handler middleware
  }
});

app.get(
  '/api/persons/:id',
  async (req, res, next) => {
    try {
      const foundPerson = await Person.findById(
        req.params.id
      );

      res.json(foundPerson);
    } catch (e) {
      next(e);
    }
  }
);

app.delete(
  '/api/persons/:id',
  async (req, res, next) => {
    await Person.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch((error) => next(error));
  }
);

app.put(
  '/api/persons/:id',
  async (req, res, next) => {
    const { name, number } = req.body;

    try {
      const updatedPerson =
        Person.findByIdAndUpdate(
          req.params.id,
          { name, number },
          {
            new: true,
            runValidators: true,
            context: 'query',
          }
        );

      res.json(updatedPerson);
    } catch (e) {
      next(e);
    }
  }
);

const unknownEndpoint = (req, res) => {
  res
    .status(404)
    .send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res
      .status(400)
      .send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res
      .status(400)
      .json({ error: error.message });
  }
  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Sever running on port ${PORT}`);
});
