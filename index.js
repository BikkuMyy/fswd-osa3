const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
        name: "Arto Hellas",
        number: "0401234567",
        id: 1
    },
    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    }
]

app.get('/', (req, res) => {

    res.send('index.html')
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
})

app.get('/info', (req, res) => {
    const date = new Date()

    Person.count({}, function (err, count) {
        res.send(
            `<div>Puhelinluettelossa ${count} henkilön tiedot<div>
        <div>${date}</div>`
        )
    })
})

app.get('/api/persons/:id', (req, res) => {

    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(Person.format(person))
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(404).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (req, res) => {

    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

nameExists = ({ name }) => {
    const person = persons.find(p => p.name === name)
    if (person === undefined) {
        return false
    }
    return true
}

generateId = () => {
    return Math.floor(Math.random() * 100)
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === '' || body.number === '') {
        return res.status(400).json({ error: 'name or number missing' })
    } else if (nameExists(body.name)) {
        return res.status(400).json({ error: 'name should be unique' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId()
    })

    console.log(body)

    person
        .save()
        .then(savedPerson => {
            res.json(Person.format(savedPerson))
        })
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})