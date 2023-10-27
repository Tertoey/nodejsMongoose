const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1]
        console.log(token)
    try{
        const token = req.headers.authorization.split(" ")[1]
        console.log(token)
        const decode = jwt.verify(token, process.env.JWT_KEY)
        req.userData = decode
        next()
    } catch(error){
        return res.status(401).json({
            messege: ' Token Failed'
        })
    }
    
}