const mongoose = require("mongoose")

const computer = new mongoose.Schema({
    OS_Information: {
        type: {
            OS: String,
            hostname: String,
            user: String,
            OS_serialNumber: String
        }
    },
    CPU: {
        type: {
            manufacturer: String,
            brand: String,
            cores: Number
        }
    },
    Memory: {
        type: {
            total: Number
        }
    },
    Disk: {
        type: {
            name: String,
            typeOfDisk: String,
            size: Number,
            serialNum: String,
            interfaceType: String
        }
    },
    MotherBoard: {
        type: {
            manufacturer: String,
            model: String,
            memSlots: Number
        }
    },
    //Ekran Kartı
    DisplayCard: { 
        type: {
            model: String,
            vendor: String,
            vram: Number
        }
    },
    SystemData: {
        type: {
            manufacturer: String,
            model: String,
            version: String,
            serial: String,
            uuid: String
        }
    },
    // Example of a property with multiple sub-properties in a row
    // Network kartlarını içeren interfaces
    NetworkInterfaces:[{
            iface: String,
            ifaceName: String,
            ip4: String,
            mac: String,
            typeOfNetworkCard: String
       
    }]
}, { timestamps: true })

module.exports = mongoose.model("Computer", computer)