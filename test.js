var mongoose=require('mongoose');
var express =require('express');
mongoose.connect('mongodb://localhost/myapp');
let articleSchema = mongoose.Schema({
    name: {
        type: String,
    },
    prices: {
        type: String,
    }
});
var Athlete = mongoose.model('Athlete', articleSchema);
Athlete.find({}, function (err, athletes) {
    if (err) throw err;
    console.log(athletes);
  })