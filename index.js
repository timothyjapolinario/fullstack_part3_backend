const http = require("http");
const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("body", (res) => {
  return JSON.stringify(res.body);
});
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
const generateNewId = () => {
  return Math.floor(Math.random() * 1000) + 1;
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

app.get("/", (request, response) => {
  response.send("<h1>Welcome to Phonebook</h1>");
});

app.get("/api/persons", (request, respone) => {
  respone.json(persons);
});

app.get("/api/info", (request, response) => {
  const date = new Date();
  response.send(`
  <h1>Phonebook has info for ${persons.length} people</h1>
  <h1>${date}</h1>
  `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params["id"];
  console.log(id);

  const person = persons.find((personObj) => {
    return personObj.id === Number(id);
  });

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params["id"]);

  persons = persons.filter((personObj) => {
    return personObj.id !== id;
  });

  res.status(204).end();
});

app.post("/api/persons/", (request, response) => {
  const body = request.body;
  const existingUser = persons.find((person) => {
    return person.name === body.name;
  });

  if (existingUser) {
    return response.status(400).json({
      error: "user is existing",
    });
  }
  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "name is number",
    });
  }

  const newPerson = {
    ...body,
    id: generateNewId(),
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
