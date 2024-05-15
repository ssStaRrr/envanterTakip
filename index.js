const si = require('systeminformation');
const mongoose = require("mongoose");
const express = require('express');
const app = express()
require('dotenv').config()
const Computer = require("./models/computer")
const Software = require("./models/software")
const {getSoftwareInfo} = require("./helpers/getSoftwarInfo")
const {getHardwareInfo} = require("./helpers/getHardwareInfo")

//Connect to the mongodb and listen port 3000
mongoose.connect(process.env.MONGO_URI_COMPASS).then(() => {
    //listen for request
    app.listen(process.env.PORT, () => {
        console.log("listening on port", process.env.PORT)
    })
}).catch((err) => {
    console.log(err)
})

 getHardwareInfo()
 getSoftwareInfo()

console.log("finished line of project")