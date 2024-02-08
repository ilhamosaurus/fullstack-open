const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
morgan.token('body', (request) =>
  JSON.stringify(request.body)
);
app.use(express.json());
app.use(morgan('tiny'));

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const MAX_RETRIES = 10; // Maximum number of attempts to find a unique ID

const generateId = () => {
  for (
    let attempt = 0;
    attempt < MAX_RETRIES;
    attempt++
  ) {
    const newId = Math.random() * 10000;

    if (
      !persons.some(
        (person) => person.id === newId
      )
    ) {
      // Check for collision
      return newId;
    }
  }
  // If no unique ID found after retries, consider alternative strategies
  throw new Error(
    'Failed to generate unique ID after retries'
  );
};

const postMorgan = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
);

app.post(
  '/api/persons',
  postMorgan,
  (request, response, next) => {
    const newPerson = request.body;
    const existPerson = persons.find(
      (person) =>
        person.name.toLowerCase() ===
        newPerson?.name?.toLowerCase()
    );

    if (!newPerson.name || !newPerson.number) {
      return response.status(404).json({
        error:
          'name and number must bu fullfiled',
      });
    }

    if (existPerson) {
      return response
        .status(404)
        .json({ error: 'person already exist' });
    }

    const verifiedPerson = {
      id: generateId(),
      name: newPerson.name,
      number: newPerson.number,
    };

    persons = persons.concat(verifiedPerson);
    response.json(persons);
  }
);

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const currentTime = new Date().toUTCString();
  const numberOfPersons = persons.length;

  const resText = `<p>Phonebook has info for ${numberOfPersons} people</p>
  <br />
  <p>${currentTime}</p>`;

  res.send(resText);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(
    (person) => person.id === id
  );
  console.log(person);

  if (!person) {
    res.status(404).json({
      error: "id didn't exist",
    });
  } else {
    res.json(person);
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = persons.findIndex(
    (person) => person.id === id
  );
  if (index !== -1) {
    const person = persons.splice(index, 1)[0];
    res.status(204).end();
  } else {
    res
      .status(404)
      .json({ error: "id doesn't exist" });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Sever running on port ${PORT}`);
});
