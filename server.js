var express = require('express');
var app = express()
var port = process.env.PORT || 3100;
var morgan = require('morgan');
var getNameRouter = require('./routes/searchProduct');
var mongoose = require('mongoose');
var bodyParser 		=	require("body-parser");
var path 			=	require('path');
var ejs = require('ejs');


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(morgan('dev'));
app.use(express.static(require('path').join(__dirname,'/public')));
app.use('/backend',getNameRouter);


mongoose.connect('mongodb://localhost:27017/project',{useNewUrlParser:true},function(err,db){
    if(err){
        console.log("Cannot connect to MongoDb");
    }else{
        console.log("Succesfully connected to Project Database!");
    }
});

app.get('/',function(req,res){
	res.render('index.ejs',{products:null});
});

app.listen(port,function(req,res){
    console.log('Server is running on port : '+port);
});