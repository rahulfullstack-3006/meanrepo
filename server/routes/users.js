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
const multer  = require('multer')
const saltRounds = 10;
const sequelize=require('../database/db');
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const fs=require('fs');
const os=require('os');
const redis=require('redis');
const app = require('../app');
const redisClient=redis.createClient(6379,'127.0.0.1');
redisClient.connect();
redisClient.on("connect",function(err){
  console.log('Connected Redis');
})

/*************** Multer  ****************/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, `images_${file.originalname}`)

  }
})

const upload = multer({
   storage: storage,
   limits:{fileSize:1000000},
   fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb( new Error('Please upload a valid image file'))
    }
    cb(undefined, true);
    // cb('Give proper files format to upload');
    }
   });
// const upload=multer({
//   storage:storage,
//   limits:{fileSize:1000000},
//   fileFilter:(req,file,cb)=>{
//     const fileTypes=/jpeg|jpg|png|gif/;
//     const mimeType=fileTypes.match(file.mimetype);
//     // const extname=fileTypes.test(path.extname(file.originalname));

//     if(mimeType){
//       return cb(null,true)
//     }
//     cb('Give proper files format to upload');
//   }
// })


/*send email after 1 minute*/
cron.schedule("*/10 * * * * *", function () {
  let heap = process.memoryUsage().heapUsed / 1024 / 1024;
  let date = new Date().toISOString();
  const freeMemory = Math.round((os.freemem() * 100) / os.totalmem()) + "%";
  //                 date | heap used | free memory
  let csv = `${date}, ${heap}, ${freeMemory}\n`;
  console.log("csv",csv);

  // storing log In .csv file
  fs.appendFile("demo.csv", csv, function (err) {
    if (err) throw err;
    console.log("server details logged!");
  });
  console.log("scheduler runs successfully");
  // mailService();

});

// cron.schedule("*/5 * * * *", function () {
//   console.log("---------------------");
//   console.log("deleting logged status");
//   fs.unlink("./demo.csv", err => {
//     if (err) throw err;
//     console.log("deleted successfully");
//   });
// });

function mailService() {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "prahul3006@gmail.com",
// use generated app password for gmail
      pass: "vkodfxvidrppcyby",
    },
  });

  // setting credentials
  let mailDetails = {
    from: "prahul3006@gmail.com",
    to: "devrahulprajapati123@gmail.com",
    subject: "Test Mail using Cron Job",
    text: "Node.js Cron Job Email Demo Test from Reflectoring Blog",
  };

  // sending email
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("error occurred", err.message);
    } else {
      console.log("---------------------");
      console.log("email sent successfully");
    }
  });
}


/*send email after 1 minute*/


router.post('/upload',upload.single('file'),(req,res)=>{
  const file=req.file;
  // const readFile=fs.readFile(file.path);
  // console.log("readFile",readFile);
  console.log("fileeeee",file);
  console.log("file.filename",file.filename);
  // console.log("req.file.buffer.toString('base64')",req.file.path.toString('base64'));
  if(req.file){
    // db.sequelize.addColumn('users', 'image', { type: DataTypes.STRING });
    User.create({
      image:req.file.filename
    })
    .then(data=>{
      console.log("data in single file",data);
      res.json({message:'File upload successfully',fileData:JSON.stringify(data)});
    })
    .catch(err=>{
      res.json({message:'No file upload'})                    //not able to handle format error
    })
  }

  
  })

// router.post('/upload',upload.single('file'),(req,res)=>{
//   const file=req.file;
//   console.log("file.filename",file.filename);
//   if(!file){
//    const error=new Error('Please upload file');
//    error.httpStatusCode=400
//    return next(error)
//   }
//   User.create(file)
//   .then(data=>{
//     res.json({message:'File upload successfully',fileData:JSON.stringify(data)});
//     // res.send(file);
//   })
//   .catch(err=>{
//     res.json({message:'No file upload'})
//   })
  
//   })


  router.post('/multipleFileUpload',upload.array('multipleFiles'),(req,res)=>{
    const files=req.files;
    console.log("req.files",req.files);
    console.log("files for multiple upload",files);
    if(files){
      res.send(files);
    }else{
      res.json({message:'No file upload'})
    }
    })
  

    /*************** Multer  ****************/

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
 router.get('/getAllData',async (req,res,next)=>{
  let keyName='normalKey';
  let getCacheData=await redisClient.get(keyName);
  if(getCacheData) {
    res.send({data:JSON.parse(getCacheData),message:'get all data successfully',status:200})
  }else {
    User.findAll({
      attributes: [
        "age",
        [db.sequelize.fn("COUNT", db.sequelize.col("age")), "count_isActive"],
      ],
      group: "age",
    })
    .then(async(result)=>{
      await redisClient.set(keyName,JSON.stringify(result),{EX:30,NX: true});
      res.send({data:result,message:'get all data successfully',status:200})
    })
    .catch(err=>{
     console.log("err",err);
    })
  }
 
  //res.send({data:result,message:'get all data successfully',status:200})

})  


 
//getDataById/:age thru sequelize only
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


//getDataById/:age thru redis
// router.get('/getDataById/:age',async (req,res)=>{
//   let dropDownId=req.params.age;
//   console.log("dropDownId",dropDownId);
//   let keyName1="dropdownkey";
//   let getCacheData1=await redisClient.get(keyName1);
//   if(getCacheData1){
//     res.json({status:true,message:'Data received successfully',data:JSON.parse(getCacheData1)})

//   }else{
//     User.findAll({
//       attributes: [
//         "age",
//         [db.sequelize.fn("COUNT", db.sequelize.col("age")), "count_isActive"],
//       ],
//       where:{age:dropDownId },
//       group: db.sequelize.col("age")
//     })
//     .then(async (user)=>{
//       console.log("ussssssssser",user);
//      if(user !== null){
//      await redisClient.set(keyName1,JSON.stringify(user))
//       res.json({status:true,message:'Data received successfully',data:user})
  
//      }else{
//       res.json({status:false,message:'No Data received',data:[]})
//      }
//     })
//     .catch(err=>{
//       res.send('err',+err)
//     })
//   }

// })


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
