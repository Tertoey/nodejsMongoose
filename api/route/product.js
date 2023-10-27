const express = require('express')
const path = require('path')
const router = express.Router()
const Product = require('../models/product')
const mongoose = require('mongoose')
const multer = require('multer') // module upload
const checkAuth = require('../middleware/checkauth')

const storage = multer.diskStorage({
    destination: function(req,file,cb){   // cb = callback
        // cb(null,'./upload/') // define path destination
        cb(null, './uploads/');
    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString().replace(/:/g, '-')+file.originalname) // define Date and filename
    }
})
const fileFilter = (req,file,cb)=>{
    //reject file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        console.log('file correct')
        cb(null, true)
    }else{
        console.log('file type not correct')
        cb(null, false)
    }
    }
const upload = multer({
    storage:storage,
    limits:{fileSize: 1024*1024*5},
    fileFilter:fileFilter
}); 

router.get('/', (req,res,next)=>{
    Product.find()
    // or .select('_id name price')
    .select('-__v -_id')
    .sort({price:-1})
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            product: docs.map(doc=>{
                return{
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage:'http://localhost:3000/'+doc.productImage,
                    request:{
                        type:"GET",
                        url:'http://localhost:3000/product/' + doc._id
                    }
                }
            })
        }
        //console.log("From database:", docs);
        // if(docs.length>0){
            res.status(200).json(response)
        // }else{
        //     res.status(404).json({
        //         message:'No products in DB!'
        //     })
        // }
    })
    .catch(errs =>{
        console.log("Error:", errs)
        res.status(404).json(errs)
    })
})

router.post('/', checkAuth ,upload.single('productImage'), (req,res,next)=>{ // upload.single() = 1 file
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage:req.file.path
    })
    product
    .save()
    .then(result=>{
        console.log(result)
        res.status(200).json({
            message: 'Create successfullyy',
            created: {
                name:result.name,
                price:result.price,
                _id:result._id,
                productImage:result.productImage
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

// By ID
router.get('/:productID', (req,res,next)=>{
    const id = req.params.productID
    Product.findById(id)
    .select('-__v -_id')
    .exec()
    .then(doc =>{
        console.log("From Database",doc)
        if(doc){
            res.status(200).json(doc)  
        }else{
            res.status(404).json({messege: 'Not found'})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err})
    })
})

router.patch('/:productID', (req,res)=>{
    const id = req.params.productID
    Product.findByIdAndUpdate(id,{$set: req.body},{new:true})
    .then(result =>{
        res.status(200).json(result)
    })
    .catch(err =>{
        res.status(500).json(err)
    })
})

router.delete('/:productID', checkAuth, (req,res)=>{
    const id = req.params.productID
    // Product.delete({_id:id})
    Product.findByIdAndRemove(id)
    .exec()
    .then(result =>{
        res.status(200).json(result)
    })
    .catch(err =>{
        res.status(500).json(err)
    })
})


module.exports = router