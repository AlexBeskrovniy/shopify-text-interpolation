require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@internalization.pnyxklp.mongodb.net/i18n?retryWrites=true&w=majority`

const dbConnect = async () => {
    try {
        mongoose.connect(MONGO_URI, { useNewUrlParser: true }).then( () => console.log('Mongo has connected.'));
    } catch(err) {
        console.error(err);
    }
}

const dbDisconnect = () => {
    try {
        mongoose.connection.close(() => {
            console.log('Mongo has disconnected');
        });
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    dbConnect,
    dbDisconnect
}