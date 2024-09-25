const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

// Middleware para registrar mensajes con Morgan en formato tiny
app.use(morgan('tiny'));

const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))

const generateId = () => {
  return Math.floor(Math.random() * 20000);
};

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Crear un token personalizado para registrar el cuerpo de las solicitudes POST
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });

  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/person/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.send(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const totalPersons = `
      <p>Phonebook has info for ${persons.length} people </p>
      <p>${new Date()}</p>`;
  response.send(totalPersons);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
 
  
  if (!body.name) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person)
    response.json(person)
});

app.delete("/api/person/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id != id);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
