const mongoose = require("mongoose");
const express = require('express');
const app = express()
require('dotenv').config()
const Computer = require("./models/computer")
const Software = require("./models/software")
const { getSoftwareInfo } = require("./helpers/getSoftwarInfo")
const { getHardwareInfo } = require("./helpers/getHardwareInfo")

// Githup API'sinden release bilgisini cekme
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const unzipper = require('unzipper');

const owner = process.env.owner;
const repo = process.env.repo;
const token = process.env.access_token;
const currentVersionFile = "currentVersion.txt"

async function checkReleases() {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
        headers: {
            'Authorization': `token ${token}`
        }
    });
    if (!response.ok) {
        throw new Error(`GitHub API responded with ${response.status}: ${response.statusText}`);
    }
    const releases = await response.json();
    return releases;
}
async function getCurrentVersion() {
    return new Promise( (resolve, reject) => {
        fs.readFile(currentVersionFile, 'utf8', (err,data)=>{
            if(err) {
                return reject(err)
            }
            resolve(data.trim())
        })
    })
}
async function setCurrentVersion(version) {
    return new Promise( (resolve, reject) => {
        fs.writeFile(currentVersionFile, version, 'utf8', (err)=> {
            if(err) {
                reject(err)
            }
            resolve()
        })
    })
}
async function downloadAndExtract(url, extractTo) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`)
    }
        return new Promise((resolve, reject) => {
            response.body.pipe(unzipper.Extract({ path: extractTo }))
                .on('close', resolve)   // Zip dosyasının başarıyla çıkarılması durumunda resolve() çağrılır.
                .on('error', reject);   // Hata oluştuğunda reject() çağrılır.
        });
    }
async function updateProject() {
    try {
        const releases = await checkReleases();
        if (releases.length === 0) {
            console.log("No releases found.");
            return;
        }
        latestRelease = releases[0]
        latestVersion = latestRelease.tag_name
        const currentVersion = await getCurrentVersion()
        
        if(currentVersion !== latestVersion) {
            console.log(`Mevcut sürümünüz: ${currentVersion}. Lütfen sürümünüzü en son sürüm olan ${latestVersion} sürümüne güncelleyiniz.`);
            //uzantisi .zip olan tüm asset'ler tek bir değişkende toplanıyor.
            const asset = latestRelease.assets.filter(a =>  a.name.endsWith('.zip'))
            console.log(asset.length)
            if (!asset) {
                console.log("son sürümde uygun bir zip dosyasi bulunmuyor")
            }
            console.log('Yeni sürüm indiriliyor...');
            //Her bir asset'in download linki üzerinden indirme işlemi yapiliyor
            asset.forEach(element => {
                console.log(element.browser_download_url)
                downloadAndExtract(element.browser_download_url, path.resolve(__dirname, ''));
            });
            //await downloadAndExtract(asset.browser_download_url, path.resolve(__dirname, ''));

            console.log("Mevcut Surum guncelleniyor...")
            await setCurrentVersion(latestVersion)
        }else {
            console.log("son sürüm mevcuttur")
        }
        
    }
    catch(err){
        console.error(`Error: ${err.message}`);
    }
}
setTimeout(updateProject, 2000); // 10000 milisaniye = 10 saniye
// Her 1 saatte bir sürümleri kontrol et
setInterval(updateProject, 60 * 60 * 1000);

// checkReleases().then(releases => {
//     // mevcut sürüm ile son sürümü karsılastıracak. mevcut sürüm güncel değil ise ona göre işlem yapacak
//     if (currentVersion !== releases[0].tag_name) {
//         //En son release, release listesinin ilk elemanıdır
//         console.log("mevcut sürümünüz:", currentVersion, `lütfen sürümünüzü en son sürüm olan ${releases[0].tag_name} sürümüne güncelleyiniz`)
//         currentVersion = releases[0].tag_name
//     } else {
//         console.log("son sürüm mevcuttur")
//     }
// })
// // Her 1 saatte bir sürümleri kontrol et
//setInterval(checkReleases, 6000);

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