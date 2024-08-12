const fs = require('fs');
const { Buffer } = require("buffer");
const { MessageMedia } = require('whatsapp-web.js');

async function envDoc(chat, response, doc) {
    const data = fs.readFileSync(doc);
    const encodedData = Buffer.from(data).toString("base64");
    const media = new MessageMedia('application/pdf', encodedData, 'you.pdf');
    await chat.sendMessage(media, { caption: 'Aqui está o seu PDF!' });
}

module.exports = envDoc;
