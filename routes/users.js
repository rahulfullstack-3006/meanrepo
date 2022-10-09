var express = require('express');
var router = express.Router();
var aes256 = require('aes256');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
var key=process.env.SECRET_KEY;
var User=require('../models/User');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
console.log("ketyyy",key);
var plaintext = req.body.password;
console.log("plaintext",plaintext);

var cipher = aes256.createCipher(key);
console.log("cipher",cipher);

var encryptedPlainText = cipher.encrypt(plaintext);
console.log("encryptedPlainText",encryptedPlainText);
// var decryptedPlainText = cipher.decrypt(encryptedPlainText);
// console.log("decryptedPlainText",decryptedPlainText);
  let registerObj={
    username:req.body.username,
    email:req.body.email,
    password:encryptedPlainText,
    mobile:req.body.mobile
  }
  console.log("registerObj",registerObj);

  User.findOne({
    where:{
      email:req.body.email
    }
  })
  .then(user=>{
    if(!user){
      User.create(registerObj)
      .then(data=>{
        res.json({status:true,message:'User login succesfully',
        userdetails:{username:data.username,email:data.email,password:data.email,mobile:data.mobile}
      })

    })
    .catch(err=>{
     res.send('err',+err)
    })

    }else{
      res.json({status:false,message:'User already exits'})
    }

  })
  .catch(err=>{
    res.send('No such user',err)
  })


});


router.post('/login',(req,res,next)=>{
  console.log(req.body.email);
  console.log(req.body.password);
  var plaintext = req.body.password;
  var cipher = aes256.createCipher(key);
  var encryptedPlainText = cipher.encrypt(plaintext);
  console.log("encryptedPlainText",encryptedPlainText);

  var comparePassword=`SELECT password from users where email='${req.body.email}'`
  console.log("comparePassword",comparePassword);
  res.send('login successfully')
})

module.exports = router;
