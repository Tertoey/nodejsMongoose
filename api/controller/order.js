const Order = require('../models/orders')

exports.order_get =  (req,res,next)=>{
    Order.find()
    .select('-__v')
    .populate('product','-__v')
    .exec()
    .then(docs =>{
        console.log(docs)
        res.status(200).json(docs)
    })
    .catch(errs =>{
        console.log("Error:", errs)
        res.status(404).json(errs)
    })
}