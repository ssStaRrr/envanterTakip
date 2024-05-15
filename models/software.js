const mongoose = require("mongoose")

const software = new mongoose.Schema({
    hostname: {
        type: String
    },
    OS_serialNumber: {
        type: String,
        unique: true
    },
    softwareInformation: [{
        appName: String,
        Publisher: String,
        appVersion: String
    }]
}, { timestamps: true })

module.exports = mongoose.model("Software", software)