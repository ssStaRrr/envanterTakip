const mongoose = require("mongoose")

const computer = new mongoose.Schema({
    name: String,
    CPU: String,
    RAM: Number,
    Disk: String
})

module.exports = mongoose.model("Computer", computer)