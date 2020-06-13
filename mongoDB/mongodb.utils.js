const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connect_json = { useNewUrlParser: true, useUnifiedTopology: true };

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, connect_json);
    }
    catch (err) {
        console.log("Can't connect to server");
        console.log(err);
    }
}

const disconnect = async () => {
    try {
        await mongoose.disconnect();
    }
    catch (err) {
        console.log("Unable to disconnect");
        console.log(err)
    }
}

const deleteDatabase = async (databaseName) => {
    try {
        await mongoose.connection.collection(databaseName).drop();
    }
    catch (err) {
        if (err.code === 26) {
            console.log(`namespace ${databaseName} not found`)
            console.log(err)
        } else {
            console.log("Not connected to any database");
            console.log(err)
        }
    }
}

module.exports = {
    connect,
    disconnect,
    deleteDatabase
}