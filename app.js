const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

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
        req.flash('success', 'Product Added');
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
        req.flash('success','Product updated');
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