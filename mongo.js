const mongoose = require('mongoose')

const url = 'mongodb://mari:ihtgpssapp@ds229438.mlab.com:29438/fs-persons'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv.length < 3) {
    Person
    .find({})
    .then(result => {
        console.log('puhelinluettelo:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else {
   const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
})

person
    .save()
    .then(result => {
        console.log(`lisätään henkilö ${result.name} numero ${result.number} luetteloon`)
        mongoose.connection.close()
    }) 
}




