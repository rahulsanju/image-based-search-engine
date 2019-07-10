var express = require('express');
app = express()
var router = express.Router();
var Product = require('../models/productSchema');
var fs = require('fs');
var name;
var multer = require('multer');
var ejs = require('ejs');

app.set('view engine', 'ejs');



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './machinelearning/')
    },
    filename: function (req, file, cb) {
      cb(null,'Image_to_be_tested.jpg')
    }
})
   
var upload = multer({ storage: storage }).single('imguploader');

router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.send("Error while uploading");
      } else if (err) {
        // An unknown error occurred when uploading.
        res.send(err);
      }
      else{
          res.send('Image uploaded succesfully<br><a href="http://localhost:3100/backend/runPythonProgram"><button class="btn btn-primary">Click Here</button></a>');
      // Everything went fine.
      }
    })
});

router.get('/getNameFromTextfile',function(req,res){

    try {
        fs.unlinkSync('machinelearning/Image_to_be_tested.jpg')
        console.log('Image')
        //file removed
      } catch(err) {
        if(err.code=='ENOENT'){
            console.log('No such image found..!');
        }
      }

    fs.readFile('machinelearning/names.txt','utf-8',function(err,data){
        if(!err){
            var str=String(data);
            var temp=str.split(":")
            if(temp.length!=2){
                res.send('Sorry! Object Cannot be detected accurately..Please check your image opened by Python..');
                console.log('Sorry! Object Cannot be detected accurately..Please check your image opened by Python..');
            }else{
                name=temp[1]
                res.send('Object Detected is '+name+"<br><a href='http://localhost:3100/backend/getProductsFromDb'><button class='btn btn-primary' >Click Here</button></a>");
                console.log('Object Detected is '+temp[1]);
            }
        }
    });
    
});

router.get('/getProductsFromDb',function(req,res){
    if(name!=null){
        Product.find({ keyword : name }).select('productName price pimg').exec(function(err,product){
            if(err){
                res.json({
                    success : false,
                    message:'Sorry!.. Cannot figure out the key word'
                });
            }if(!product){
                res.json({
                    success : false,
                    message:'Sorry!.. Cannot find the product matching the keyword..!'
                });
            }else if(product){
                
                res.render("index.ejs",{products : product});
                console.log("rendered data to index.ejs");
            }
        })
    }else{
        res.send('An error occured..Please check your image produced by python..')
    }
});
router.get('/runPythonProgram',function(req,res){
    var python = require('python-shell');
    python.PythonShell.run('./machinelearning/image_objectdetection.py',null,function(err){
        if(err){
            throw err;
        }
        res.send("Object Detection done! names.txt file is updated<br><a href='http://localhost:3100/backend/getNameFromTextFile'><button class='btn btn-primary' >Click Here</button></a>");
        console.log('Python Program finished and names.txt file is updated...');
    })
    
})

module.exports = router;