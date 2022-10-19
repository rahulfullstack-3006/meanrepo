const Sequelize=require('sequelize');
const db={};

const sequelize=new Sequelize('employee_details','appuser','12345678',{
    host:'localhost',
    dialect:'mysql',
    operatorAliases:0,

    pool:{
        max:5,
        min:0,
        accquire:30000,
        idle:10000
    }

})

db.sequelize=sequelize;
db.Sequelize=Sequelize;


sequelize
    .authenticate()
    .then(() => {
        console.log('DB connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(0);
    })




module.exports=db;