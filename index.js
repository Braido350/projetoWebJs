const { Client, LocalAuth } = require('whatsapp-web.js');
const funcMessage = require('./src/response')
const qrcode = require('qrcode-terminal');
const INACTIVITY_TIMEOUT = 60000;
const db = require('./src/DB');
const { getState } = require('./src/state');
const chatsState = {};

let timers = {}

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    console.log('QR RECEIVED')
    qrcode.generate(qr, { small: true })
});

client.on('ready', () => {
    console.log('Deu tudo certo.')
});

client.on('message', async message => {
    const chat = await message.getChat();
    const chatId = chat.id._serialized;
    const userPhone = chat.id._serialized;
    const userName = message._data.notifyName || 'Desconhecido';

    if (!db.getUser(userPhone)) {
        db.addUser(userPhone, userName);
    }

    console.log(`User ${userName} (${userPhone}) has sent a message: ${message.body}`);

    if (!chatsState[chatId]) {
        chatsState[chatId] = { state: 'Welcome', timer: null };
    }

    if (timers[chatId]) {
        clearTimeout(timers[chatId]);
    }
    timers[chatId] = setTimeout(() => resetState(chatId
    ), INACTIVITY_TIMEOUT);

    await delay(500);

    switch (getState()) {
        case 'Welcome':
            await funcMessage.Welcome(chat);
            console.log(`State set to: ${getState()}`);
            break;

        case 'ask_issue':
            await funcMessage.askIssue(chat, message.body);
            console.log(`State set to: ${getState()}`);
            break;

        case 'provide_solution':
            await funcMessage.provideSolution(chat, message.body);
            console.log(`State set to: ${getState()}`);

            break;

        case 'end':
            await funcMessage.endSupportConversation(chat);
            console.log(`State set to: ${getState()}`);

            break;

        default:
            console.log(`Unknown state: ${chatsState[chatId].state}`);
            break;
    }

})


function resetState(chatId) {
    if (chatsState[chatId]) {
        chatsState[chatId].state = 'Welcome';
        console.log(`Sessão expirada para o chat ${chatId}. Estado resetado.`);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.initialize();