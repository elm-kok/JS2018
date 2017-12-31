const express = require('express');
const router = express.Router();
let Product = require('../models/product');
router.get('/add', (req, res) => {
    res.render('add_product', {
        title: 'Add Product'
    });
});
router.get('/:id', (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        res.render('product', {
            product: product
        });
    });
});
router.get('/edit/:id', (req, res) => {
    Product.findById(req.params.id, (err, product) => {
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
        product._id = req.params.id;
        res.render('edit_product', {
            title: 'Edit Product',
            product: product,
            errors: errors
        });
    } else {
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
            req.flash('success', 'Product updated');
            res.redirect('/');
        });
    }
});
router.delete('/:id', (req, res) => {
    let query = {
        _id: req.params.id
    };
    Product.remove(query, (err) => {
        if (err) console.log(err);
        res.send('Success');
    });
});
module.exports = router;