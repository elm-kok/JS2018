const express = require('express');
const router = express.Router();
let Product = require('../models/product');
let User = require('../models/user');
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_product', {
        title: 'Add Product'
    });
});
router.get('/:id', (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        User.findById(product.author, (err, user) => {
            res.render('product', {
                product: product,
                author: user.name
            });
        });
    });
});
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        if (product.author != req.user.id) {
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        res.render('edit_product', {
            title: 'Edit Product',
            product: product
        });
    });
});
router.post('/add', (req, res) => {
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('prices', 'Prices is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        res.render('add_product', {
            title: 'Add Product',
            errors: errors
        });
    } else {
        let product = new Product();
        product.name = req.body.name;
        product.author = req.user._id;
        product.prices = req.body.prices;
        product.save((err) => {
            if (err) {
                throw err;
                return;
            }
            req.flash('success', 'Product Added');
            res.redirect('/');
        });
    }
});
router.post('/edit/:id', (req, res) => {
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('prices', 'Prices is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        let product = {};
        product.name = req.body.name;
        product.author = req.user._id;
        product.prices = req.body.prices;
        product._id = req.params.id;
        res.render('edit_product', {
            title: 'Edit Product',
            product: product,
            errors: errors
        });
    } else {
        let product = {};
        product.name = req.body.name;
        product.author = req.user._id;
        product.prices = req.body.prices;
        let query = {
            _id: req.params.id
        };
        Product.update(query, product, (err) => {
            if (err) {
                throw err;
                return;
            }
            req.flash('success', 'Product updated');
            res.redirect('/');
        });
    }
});
router.delete('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send();
    }
    let query = {
        _id: req.params.id
    };
    Product.findById(req.params.id, (err, product) => {
        if (product.author != req.user.id) {
            res.status(500).send();
        } else {
            Product.remove(query, (err) => {
                if (err) console.log(err);
                res.send('Success');
            });
        }
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}
module.exports = router;