const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myapp');
let db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});
db.once('error', () => {
    console.log(err);
});
let name = require('./models/name');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.get('/', (req, res) => {
    name.find({}, (err, result) => {
        if (err) throw err;
        res.render('index', {
            title: 'Article',
            result: result
        });
        console.log(result.toString());
    });
});
app.listen('3000', () => {
    console.log('port 3000');
});