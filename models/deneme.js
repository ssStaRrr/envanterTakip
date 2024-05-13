const mongoose = require("mongoose")

const deneme = new mongoose.Schema({
    
    name: String,
    address: {
        type: {
            street: String,
            city: String,
            country: String
        },
        required: true
    }
})

module.exports = mongoose.model("Deneme", deneme)