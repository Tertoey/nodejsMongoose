const express = require('express');
const app = express();
const productRoute = require('./api/route/product');
const orderRoute = require('./api/route/orders');
const userRoute = require('./api/route/user')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://klo123645:'+ process.env.MONGO_ATLAS_PW +'@cluster0.9djy9xz.mongodb.net/mydb?retryWrites=true&w=majority')

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Header','Origin, X-Requested-With, Content-Type, Accept, Authorization ')
    //res.header('Access-Control-Allow-Methods','POST, GET, PUT, PATCH, DELETE, OPTIONS') or v
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','POST, GET, PUT, PATCH, DELETE')
        return res.status(200).json({})
    }
    next();
})

app.use(morgan('dev'))
app.use('/uploads',express.static('uploads')) // ignore uploads
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use('/product', productRoute) // ต่อท้าย 127.0.0.1
app.use('/orders', orderRoute)
app.use('/user',userRoute)

// app.use((req,res,next)=>{
//     const error = new error('Not found')
//     error.status= 404
//     next(error);
// })

// app.use((error,req,res,next)=>{
//     res.status(error.status || 500)
//     res.json({
//         message : error.message
//     })
// })
 
module.exports = app