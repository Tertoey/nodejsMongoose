const express = require('express')
const router = express.Router()
const Order = require('../models/orders')
const Product = require('../models/product')
const mongoose = require('mongoose')

const Ordercontroller = require('../controller/order')

router.get('/',Ordercontroller.order_get)

router.post('/', (req,res,next)=>{
    Product.findById(req.body.productId)
    .then(product=>{
        if(!product){
            return res.status(404).json({
                messege: 'Product not found'
            })
        }
        const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
        })
        return order.save()
    })
    .then(result=>{
        if(res.statusCode===404){
            return res;
        }
        console.log(result)
        res.status(200).json({
            messege:'Order get',
            result:result
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// // By ID
router.get('/:orderId', (req,res,next)=>{
    const id = req.params.orderId
    Order.findById(id)
    .select('-__v')
    .populate('product','-__v')
    .exec()
    .then(order =>{
        if(order){
            res.status(200).json(order)  
        }else{
            res.status(404).json({messege: 'Not found'})
        }
    })
    .catch(err => {
        res.status(500).json({error:err})
    })
})

// router.patch('/:productID', (req,res)=>{
//     const id = req.params.productID
//     Product.findByIdAndUpdate(id,{$set: req.body},{new:true})
//     .then(result =>{
//         res.status(200).json(result)
//     })
//     .catch(err =>{
//         res.status(500).json(err)
//     })
// })

router.delete('/:orderId', (req,res,next)=>{
    const id = req.params.orderId
    // Product.delete({_id:id})
    Order.findByIdAndRemove(id)
    .exec()
    .then(result =>{
        res.status(200).json(result)
    })
    .catch(err =>{
        res.status(500).json(err)
    })
})


module.exports = router