let mongoose = require('mongoose');
let productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    prices: {
        type: String,
        required: true
    }
}, {
    collection: 'product'
});
let O = module.exports = mongoose.model('a', productSchema);