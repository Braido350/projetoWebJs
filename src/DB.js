const fs = require('fs');
const path = require('path');

const DB_FILE_PATH = path.join(__dirname, '../database/db.json');

class Database {
    constructor() {
        this.loadDatabase();
    }

    loadDatabase() {
        if (fs.existsSync(DB_FILE_PATH)) {
            const data = fs.readFileSync(DB_FILE_PATH, 'utf8');
            this.db = JSON.parse(data);
        } else {
            this.db = {};
        }
    }

    saveDatabase() {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.db, null, 2));
    }

    addUser(phoneNumber, name) {
        if (!this.db[phoneNumber]) {
            this.db[phoneNumber] = { name };
            this.saveDatabase();
            console.log(`User ${name} added with phone number ${phoneNumber}.`);
        } else {
            console.log(`Phone number ${phoneNumber} is already registered.`);
        }
    }

    getUser(phoneNumber) {
        return this.db[phoneNumber] || null;
    }

    updateUser(phoneNumber, newName) {
        if (this.db[phoneNumber]) {
            this.db[phoneNumber].name = newName;
            this.saveDatabase();
            console.log(`User ${phoneNumber} updated to ${newName}.`);
        } else {
            console.log(`Phone number ${phoneNumber} not found.`);
        }
    }

    deleteUser(phoneNumber) {
        if (this.db[phoneNumber]) {
            delete this.db[phoneNumber];
            this.saveDatabase();
            console.log(`User with phone number ${phoneNumber} deleted.`);
        } else {
            console.log(`Phone number ${phoneNumber} not found.`);
        }
    }
}

module.exports = new Database();
