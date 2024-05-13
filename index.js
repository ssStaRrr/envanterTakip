const si = require('systeminformation');
const mongoose = require("mongoose");
const express = require('express');
const app = express()
require('dotenv').config()
const Computer = require("./models/computer")
const Deneme = require("./models/deneme")

mongoose.connect(process.env.MONGO_URI).then(() => {
    //listen for request
    app.listen(process.env.PORT, () => {
        console.log("listening on port", process.env.PORT)
    })
}).catch((err) => {
    console.log(err)
})


async function getHardwareInfo() {
    try {
        const osInfo = await si.osInfo();
        const cpuData = await si.cpu();
        const memData = await si.mem();
        const diskData = await si.diskLayout();
        const users = await si.users();
        const motherboardData = await si.baseboard();
        const graphicsData = await si.graphics();
        const systemdata = await si.system()
        const networkInterfacesData = await si.networkInterfaces();

        //extract network Card with empty ipv4 and create new updated Network Card interfaces
        const updatedNetworkInterfaces = []
        for(let i =0; i<networkInterfacesData.length; i++) {
            if(networkInterfacesData[i].ip4.length!==0) {
                updatedNetworkInterfaces.push(networkInterfacesData[i])
            }
        }

        console.log(updatedNetworkInterfaces)

        const computer = await Computer.create({
            OS_Information: {
                OS: osInfo.distro,
                hostname: osInfo.hostname,
                user: users[0].user
            },
            CPU: {
                manufacturer: cpuData.manufacturer,
                brand: cpuData.brand,
                cores: cpuData.cores
            },
            Memory: {
                //bayt'ı GB'a çevirme
                total: memData.total/ 1073741824
            },
            Disk: {
                name: diskData[0].name,
                typeOfDisk: diskData[0].type,
                // //bayt'ı GB'a çevirme
                size: (diskData[0].size)/1073741824,
                serialNum: diskData[0].serialNum,
                interfaceType: diskData[0].interfaceType
            },
            MotherBoard: {
                manufacturer: motherboardData.manufacturer,
                model: motherboardData.model,
                memSlots: motherboardData.memSlots
            },
            DisplayCard: {
                model: graphicsData.controllers[0].model,
                vendor: graphicsData.controllers[0].vendor,
                vram: graphicsData.controllers[0].vram
            },
            SystemData: {
                manufacturer: systemdata.manufacturer,
                model: systemdata.model,
                version: systemdata.version,
                serial: systemdata.serial,
                uuid: systemdata.uuid
            },
            NetworkInterfaces: updatedNetworkInterfaces
        })
        await computer.save().then((data)=> {
            console.log("computer saved", data)
        }).catch(err=> {
            console.error('Error creating computer:', err);
        })
    } catch (error) {
        console.error('Error:', error);
    }
}
getHardwareInfo();
