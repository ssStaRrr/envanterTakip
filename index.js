const si = require('systeminformation');
const mongoose = require("mongoose");
const express = require('express');
const app = express()
require('dotenv').config()
const Computer = require("./models/computer")

mongoose.connect(process.env.MONGO_URI).then(()=> {
    //listen for request
    app.listen(process.env.PORT, ()=> {
        console.log("listening on port", process.env.PORT)
    })
}).catch((err)=> {
    console.log(err)
})

async function getHardwareInfo() {
    try {
        const osInfo = await si.osInfo();
        const cpuData = await si.cpu();
        const memData = await si.mem();
        const diskData = await si.diskLayout();
        const  users =   await si.users();       
        const graph = await si.graphics();
        const nwtworkConnection = await si.networkInterfaces();
        const systemdata = await si.system()

        console.log('name:', osInfo);
        console.log('CPU:', cpuData);
        console.log('Memory:', memData);
        console.log('Disk:', diskData);
        console.log('systemdata:', systemdata);
        console.log("network connection",nwtworkConnection )
        console.log('users', users)
        // const computer = await Computer.create({
        //     name: osInfo.hostname,
        //     CPU: cpuData.brand,
        //     RAM: 16,
        //     Disk: "516 GB SSD"
        // })
    } catch (error) {
        console.error('Error:', error);
    }
}
getHardwareInfo();

// const express = require("express")

// app = express()
// app.get("/", (req,res)=> {
//     res.send("hello world")
// })

// app.listen(3000, ()=> {
//     console.log("Listening")
// })
