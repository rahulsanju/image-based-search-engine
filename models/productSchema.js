var mongoose = require('mongoose');
var schema = mongoose.Schema;

var ProductSchema = new schema({
    keyword		: { type : String , required : true },
    productName 		: { type : String , required : true },
    price 		: { type : String , required : true },
    pimg 		: { type : String , required : true },
})

module.exports = mongoose.model('Product',ProductSchema);