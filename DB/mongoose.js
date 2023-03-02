const mongoose = require('mongoose');
require('dotenv').config();

database().catch(err => console.log(err));

async function database() {
    mongoose.connect(`mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PW}@cluster0-shard-00-00.inu1u.mongodb.net:27017,cluster0-shard-00-01.inu1u.mongodb.net:27017,cluster0-shard-00-02.inu1u.mongodb.net:27017/?ssl=true&replicaSet=atlas-c9cxen-shard-0&authSource=admin&retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useUnifiedTopology: true
        }
    );
}


const LocaleSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String,
        unique: true,
        required: true
    }
})

const StoreSchema = new mongoose.Schema({
    url: {
        type: String,
        unique: true,
    },
    key: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    locales: [
        LocaleSchema
    ]
});

module.exports = {
    StoreSchema
}