const express = require('express');
const router = express.Router();
const animation = require('../models/animations');
const multer = require('multer');
const fs = require('fs');

//image upload
var storage = multer.diskStorage({
destination: function(req, file, cb){
    cb(null, './uploads');
},
filename: function(req, file, cb){
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
},
});

var upload = multer({
    storage: storage,
}).single('image');

//Insert an ani into DB route
router.post('/add', upload, (req, res) => {
    const ani = new animation({
        title: req.body.title,
        plot: req.body.plot,
        image: req.file.filename,
    });
    ani.save((err) => {
        if(err){
            res.json({message:err.message, type:'danger'});
        }else{
            req.session.message ={
                type:'success',
                message: 'Ani added successfully!'
            };
            res.redirect('/');
        }
    });
})


//Get all animations route
router.get("/",(req, res) => {
    animation.find().exec((err, animations) => {
    if(err){
        res.json({message: err.message});
    }else{
        res.render("index",{
            title:"Home Page",
            animations: animations,
        })
    }
    });
});

router.get('/add', (req,res) => {
    res.render("add_ani",{ title:"add ani"});
});

//Edit an Ain route
router.get('/edit/:id', (req, res) => {
    let id =  req.params.id;
    animation.findById(id,(err, Ani) =>{
        if(err){
            res.redirect('/');
        }else{
            if(Ani == null){
                res.redirect('/')
            }else{
                res.render("edit_ani",{
                    title:"edit Ani",
                    Ani: Ani,
                })
            }
        }
    });
});

//update ani route
router.post('/update/:id',upload,(req, res) => {
 let id = req.params.id;
 let new_image = "";

 if (req.file){
    new_image = req.file.filename;
    try{
        fs.unlinkSync("./uploads/" + req.body.old_image);
    }catch(err){
        console.log(err);
    }
 }else{
    new_image = req.body.old_image;
 }
 animation.findByIdAndUpdate(id,{
    title:req.body.title,
    plot:req.body.plot,
    image:new_image,
 }, (err,result) => {
    if(err){
        res.json({message: err.message, type:'danger'});
    }else{
        req.session.message = {
            type:'success',
            message: 'Ani updated successfully!'
        };
        res.redirect('/');
    };
 });
});

//Delete Ani route
router.get('/delete/:id', (req, res) =>{
    let id = req.params.id;
    animation.findByIdAndRemove(id, (err, result) => {
        if (result.image != ""){
            try{
                fs.unlinkSync("./uploads/" + result.image);
            }catch(err){
                console.log(err);
            }
        }
        if (err){
            res.json({message: err.message})
        }else{
            req.session.message = {
                type:"info",
                message: "ani deleted successfully!"
            }
            res.redirect('/')
        }
    })
})
module.exports = router;