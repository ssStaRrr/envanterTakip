const { exec } = require('child_process');

const command = 'node index.js'; // Buraya çalıştırmak istediğiniz komutu yazın

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Hata oluştu: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`Hata: ${stderr}`);
        return;
    }

    console.log(`Çıktı: ${stdout}`);
});