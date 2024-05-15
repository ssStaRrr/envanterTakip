const Software = require("../models/software")
const si = require('systeminformation');

const getSoftwareInfo = async() => {
    //GET INSTALLED APPS-SOFTWARES INFORMATION
    const { getInstalledApps } = require('get-installed-apps')
    const allSoftwares = []
    getInstalledApps().then(async (apps) => {
        const osInfo = await si.osInfo();

        // take a particular part of all Software Data
        apps.forEach(async (app) => {
            const { appName, Publisher, appVersion } = app
            let sofwareInfoPart = {
                "appName": appName,
                "Publisher": Publisher,
                "appVersion": appVersion
            }
            allSoftwares.push(sofwareInfoPart)
        });

        // Check there is any matching Document in the database. İf you have it, update document. if not, create new Document 
        const findedSoftware = await Software.findOne({ OS_serialNumber: osInfo.serial })
        if (!findedSoftware) {
            const software = await Software.create({
                softwareInformation: allSoftwares,
                hostname: osInfo.hostname,
                OS_serialNumber: osInfo.serial
            })
            software.save().then(() => {
                console.log("software created")
            })
        }
        else {
            const updatedSoftware = await Software.findOneAndUpdate({ OS_serialNumber: osInfo.serial }, {
                softwareInformation: allSoftwares
            })
            updatedSoftware.save().then(() => {
                console.log("software updated")
            }).catch(err => {
                console.error('Error update software:', err);
            })
        }
    })
}

module.exports = {
    getSoftwareInfo
}
