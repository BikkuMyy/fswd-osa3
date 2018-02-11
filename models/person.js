const mongoose = require('mongoose')

const url = 'mongodb://mari:ftrsprcdr@ds229438.mlab.com:29438/fs-persons'

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.statics.format = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person