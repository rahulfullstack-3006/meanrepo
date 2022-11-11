var express = require('express');
var router = express.Router();
var aes256 = require('aes256');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
var key=process.env.SECRET_KEY;
var User=require('../models/User');
var jwt = require('jsonwebtoken');
var db=require('../database/db');
const bcrypt = require('bcrypt');
const e = require('express');
const saltRounds = 10;
const sequelize=require('../database/db')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Using bcyrpt
// router.post('/register', async function(req, res, next) {
//     const encryptPassword= await bcrypt.hashSync(req.body.password,10);
//     console.log("encryptPassword",encryptPassword);
//     let registerObj={
//       username:req.body.username,
//       email:req.body.email,
//       password:encryptPassword,
//       mobile:req.body.mobile
//     }
//     console.log("registerObj",registerObj);
  
//     User.findOne({
//       where:{
//         email:req.body.email
//       }
//     })
//     .then(user=>{
//       if(!user){
//         User.create(registerObj)
//         .then(data=>{
//           res.json({status:true,message:'User login succesfully',
//           userdetails:{username:data.username,email:data.email,password:data.password,mobile:data.mobile}
//         })
  
//       })
//       .catch(err=>{
//        res.send('err',+err)
//       })
  
//       }else{
//         res.json({status:false,message:'User already exits'})
//       }
  
//     })
//     .catch(err=>{
//       res.send('No such user',err)
//     })
  
  
//   });


//register for highchart
router.post('/register', async function(req, res, next) {
  const encryptPassword= await bcrypt.hashSync(req.body.password,10);
  console.log("encryptPassword",encryptPassword);
  let registerObj={
    username:req.body.username,
    age:req.body.age,
    password:encryptPassword,
    standard:req.body.standard
  }
  console.log("registerObj",registerObj);

  User.findOne({
    where:{
      username:req.body.username
    }
  })
  .then(user=>{
    if(!user){
      User.create(registerObj)
      .then(data=>{
        res.json({status:true,message:'User register succesfully',
        userdetails:{username:data.username,standard:data.standard,password:data.password,age:data.age}
      })

    })
    .catch(err=>{
      res.status(400).send(err)
    })

    }else{
      res.json({status:false,message:'User already exits'})
    }

  })
  .catch(err=>{
    res.status(400).send(err)
  })


});


//login for highchart
router.post('/login',async(req,res,next)=>{
 console.log("req.body.password",req.body.password,req.body.username);
  const user = await User.findOne({ where : {username : req.body.username }});
  console.log("user",user);
  // console.log("password compare",req.body.password,user.password);
const result = bcrypt.compareSync(req.body.password, user.password);
console.log("result",result);
  if(user){
  if(result){
    let token=jwt.sign(user.dataValues,process.env.SECRET_KEY,{
      expiresIn:1440
    })

    User.update(                              //we are not storing token in register API that's why in login we are updating
      { token:token },
      { where: { id: user.id } }
    )
      .then(result => {
       console.log("result token",result);
  })
      .catch(err =>{
      console.log("err",err);
  })
    res.json({status:true,message:'User login successfully',token:token})
  }else{
     res.json({status:false,message:'Password is incorrect'})
  }
  }
  else{
   res.json('No such User')
  }   
   });



 //get data from db for highchart
 router.get('/getAllData',(req,res,next)=>{
  User.findAll({
    attributes: [
      "age",
      [db.sequelize.fn("COUNT", db.sequelize.col("age")), "count_isActive"],
    ],
    group: "age",
  })
  .then(result=>{
    console.log("result",result);
  res.send({data:result,message:'get all data successfully',status:200})

  })
  .catch(err=>{
    console.log(err);
  })

})  


router.get('/getDataById/:age',(req,res)=>{
  let dropDownId=req.params.age;
  console.log("dropDownId",dropDownId);
  User.findAll({
    attributes: [
      "age",
      [db.sequelize.fn("COUNT", db.sequelize.col("age")), "count_isActive"],
    ],
    where:{age:dropDownId },
    group: db.sequelize.col("age")
  })
  .then(user=>{
    console.log("ussssssssser",user);
   if(user !== null){
    res.json({status:true,message:'Data received successfully',data:user})
   }else{
    res.json({status:false,message:'No Data received',data:[]})
   }
  })
  .catch(err=>{
    res.send('err',+err)
  })
})


// router.post('/getDataById',(req,res)=>{
//   let idAge=req.body.age;
//   console.log("ageeee",age);
//   User.findOne({
//     where:{
//       age:idAge
//     }
//   })
//   .then(user=>{
//     console.log("user",user);
//     // if(user !== null){
//     //   res.json({status:true,message:'Data received successfully',data:user})
//     // }
//     // else{
//     //   res.json({status:false,message:'No Data received',data:[]})
//     // }
//     res.json({status:true,message:'Data received successfully',data:user})
//   })
//   // .catch(err=>{
//   //   res.send('err',+err)
//   // })
// })



// router.post('/login',async(req,res,next)=>{
//   const user = await User.findOne({ where : {email : req.body.email }});
//   console.log("user",user);
//   console.log("password compare",req.body.password,user.password);
// const result = bcrypt.compareSync(req.body.password, user.password);
// console.log("result",result);
//   if(user){
//   if(result){
//     let token=jwt.sign(user.dataValues,process.env.SECRET_KEY,{
//       expiresIn:1440
//     })
//     res.json({status:true,message:'User login successfully',token:token})
//   }else{
//      res.json({status:false,message:'Password is incorrect'})
//   }
//   }
//   else{
//    res.json('No such User')
//   }   
//    });



//profile postman :-use headers in postman key as Authorization and value as token 
// router.get('/profile',(req,res,next)=>{
//   let profileHeaders=jwt.verify(req.headers['authorization'],process.env.SECRET_KEY);
//   console.log("profileHeaders",profileHeaders);

//   User.findOne({
//     where:{
//       id:profileHeaders.id
//     }
//   })
//   .then(user=>{
//     if(user){
//       res.json({data:user.dataValues,status:200,message:'User Profile'})

//     }else{
//        res.json({status:'',message:'No such user'})
//     }
//   })
//   .catch(err=>{
//     res.send('err',+err)
//   })

//   // res.send('profile getting')
// })


router.get('/get_by_id/:id',(req,res,next)=>{
  let userId=req.params.id;
  
  User.findAll({
    where:{
      id:userId
    }
  })
  .then(user=>{
    if(user!==null){
    res.json({status:true,message:'User get data successfully',data:user})
    }else{
    res.json({status:true,message:'',data:''})
    }
  })
  .catch(err=>{
    res.send('err',+err)
  })
})

router.post('/edit_by_id/:id',(req,res,next)=>{
  let userId=req.params.id;
  console.log("userId",userId);
  let editObj={
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
    mobile:req.body.mobile
  }
  console.log("editObj",editObj);


  User.findOne({
    where:{
      id:userId
    }
  })
  .then(user=>{
    if(user!==null){
     user.update({
      username:req.body.username,
      email:req.body.email,
      password:req.body.password,
      mobile:req.body.mobile
     })
     .then(updateData=>{
      if(updateData!==null){
      console.log("updateData",updateData);
      res.json({status:true,message:'User data updated succcesfully',data:updateData})

      }else{
      console.log("inside else block");
      res.json({status:false,message:'No data updated'})

      }
     })
    }else{
      res.json({status:false,message:'No data updated'})

    }
  })
})

module.exports = router;
