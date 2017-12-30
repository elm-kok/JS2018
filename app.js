const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect('mongodb://localhost/myapp');
let db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});
db.once('error', () => {
    console.log(err);
});
let Product = require('./models/product');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.get('/', (req, res) => {
    Product.find({}, (err, result) => {
        if (err) throw err;
        res.render('index', {
            title: 'My Product',
            result: result
        });
        //console.log(result.toString());
    });
});
app.get('/product/add', (req, res) => {
    res.render('add_product', {
        title: 'Add Product'
    });
});
app.post('/product/add', (req, res) => {
    let product = new Product();
    //console.log(req.body.name);
    product.name = req.body.name;
    product.prices = req.body.prices;
    product.save((err) => {
        if (err) {
            throw err;
            return;
        }
        res.redirect('/');
    });
});
app.listen('3000', () => {
    console.log('port 3000');
});