const router = require('express').Router();
var db = require('./db/index.js');
const jwt = require('jsonwebtoken')
//validation
const joi = require ('@hapi/joi')
const bcrypt = require ('bcryptjs')
const dotenv = require('dotenv'); 
dotenv.config();

const signschema = joi.object({
    username: joi.string().min(6).required(),
    email: joi.string().required().email(),
    password: joi.string().min(8).required()
})

router.post('/signup',async( req,res)=>{
    const {error} = signschema.validate(req.body);
   if(error) 
   return res.status(400).send(error.details[0].message)

//check if  user already exists in db 

    //create new user in the db
    const emailexist = await db.User.findOne({email: req.body.email})
    if(emailexist)
    return res.status(400).send("email already exist")

    //hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const user = {username: req.body.username,
    password : hashedPassword,
    email: req.body.email}
  
    // const user = new db.User({
    //     username: req.body.username,
    //     password : hashedPassword,
    //     email: req.body.email
    // });
    try{
        const savedUser = await db.saveUser(user)
        res.send({user: savedUser._id});
    }catch(err){
      
        res.status(400).send(err)
    }
})

const logschema = joi.object({
  
    email: joi.string().required().email(),
    password: joi.string().min(8).required()
})
router.post('/login',async( req,res)=>{
    const {error} = logschema.validate(req.body);
   if(error) 
   return res.status(400).send(error.details[0].message)

   //check if useris registered in the db
   const user = await db.User.findOne({email: req.body.email})
   //check email does not exist 
   if(!user)
   return res.status(400).send("Password or Email is invalid")
    //check password 
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword)
    return res.status(400).send("Password or Email is invalid")
    //create and assign token
    // console.log(process.env.SECRET_TOKEN)
    const token = jwt.sign({_id: user._id},  process.env.SECRET_TOKEN);

    res.send(token)
   
})

module.exports=router;