const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

router.post('/signup',(req,res,next)=>{
    User.find({ email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length >=1){
            return res.status(409).json({
                messege:'Email already exist'
            })
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if (err) {
                    return res.status(500).json({
                        error : err
                    })
                }else{
                    const user = new User({
                        _id:new mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password: hash
                    })
                    user.save()
                    .then(result =>{
                        console.log(result)
                        res.status(200).json({
                            messege: 'User created'
                        })
                    })
                    .catch(err =>{
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
})

router.post('/login',(req,res,next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length<1){
            return res.status(401).json({
                messege: 'Auth Failed(Email)'
            })
        }else{
            bcrypt.compare(req.body.password, user[0].password,(error,result)=>{
                if(result){
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,{
                        expiresIn:"10m"
                    })
                    console.log(token)
                    return res.status(200).json({
                        messege: 'Login successful',
                        Token: token
                    })
                }else{
                    return res.status(401).json({
                        messege: 'Password not correct'
                    })
                }
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error: 'error'
        })
    })
})

router.delete('/:userId',(req,res,next)=>{
    const id = req.params.userId
    User.findByIdAndRemove(id)
    .exec()
    .then(del=>{
        res.status(200).json({
            messege:"User "+del.email+" Delete"
        })
    })
    .catch(err=>{
        res.status(500).json(err)
    })
})

module.exports=router