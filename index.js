const si = require('systeminformation');
const mongoose = require("mongoose");
const express = require('express');
const app = express()
require('dotenv').config()
const Computer = require("./models/computer")
const Software = require("./models/software")
const {getSoftwareInfo} = require("./helpers/getSoftwarInfo")
const {getHardwareInfo} = require("./helpers/getHardwareInfo")

// Githup API'sinden release bilgisini cekme
const fetch = require('node-fetch');


async function checkReleases() {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
        headers: {
            'Authorization': `token ${process.env.access_token}`
        }
    });
    const releases = await response.json();
    console.log(releases);
}
checkReleases()
// Her 1 saatte bir sürümleri kontrol et
setInterval(checkReleases, 3600000);

//Connect to the mongodb and listen port 3000
mongoose.connect("mongodb://172.16.1.72:27017").then(() => {
    //listen for request
    app.listen(3000, () => {
        console.log("listening on port", 3000)
    })
}).catch((err) => {
    console.log(err)
})

 getHardwareInfo()
 getSoftwareInfo()

console.log("finished line of project")