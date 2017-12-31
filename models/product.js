let mongoose = require('mongoose');
let productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    prices: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    collection: 'product'
});
let Product = module.exports = mongoose.model('product', productSchema);