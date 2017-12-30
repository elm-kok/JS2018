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
app.get('/product/:id', (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        res.render('product', {
            product: product
        });
    });
});
app.get('/product/edit/:id', (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        res.render('edit_product', {
            title: 'Edit Product',
            product: product
        });
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
app.post('/product/edit/:id', (req, res) => {
    let product = {};
    product.name = req.body.name;
    product.prices = req.body.prices;
    let query = {
        _id: req.params.id
    };
    Product.update(query, product, (err) => {
        if (err) {
            throw err;
            return;
        }
        res.redirect('/');
    });
});
app.delete('/product/:id', (req, res) => {
    let query = {
        _id: req.params.id
    };
    Product.remove(query, (err) => {
        if (err) console.log(err);
        res.send('Success');
    });
});
app.listen('3000', () => {
    console.log('port 3000');
});