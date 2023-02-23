require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const fs = require('fs');
const path = require('path');

const { Locale } = require('./models/locale.js');

const app = express();
app.use(express.json());

// const data = JSON.stringify(JSON.parse(fs.readFileSync(path.join(__dirname, 'ru.json'))));

// const body = {
//     lang: 'ru',
//     doc: data
// }

// app.get('/', async (req, res) => {
//     try {
//         const locale = new Locale(body);

//         await locale.save();

//         res.redirect('/redirect');
//     } catch(err) {
//         console.error(err);
//     }
    
// });

app.get('/redirect', (req, res) => {
    res.send('Done!!!');
})

app.get('/find', async(req, res) => {
    try {
        const locale = await Locale.findOne({ lang: 'ru' });
        const validData = JSON.parse(locale.doc);
        fs.writeFileSync(path.join(__dirname, './test-db-json/ru.json'), JSON.stringify(validData, null, '\t'));
        res.send(validData);
    } catch(err) {
        console.error(err);
    }
})


//MongoDB Connection  mongodb+srv://AleksandrBeskrovniy:<password>@internalization.pnyxklp.mongodb.net/?retryWrites=true&w=majority
mongoose
	.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@internalization.pnyxklp.mongodb.net/i18n?retryWrites=true&w=majority`, {
		useNewUrlParser: true
	}) 
	.then( () => console.log('Mongo has connected.'))
	.catch(err => console.log(err));


app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT}`);
});
