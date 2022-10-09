const Sequelize=require('sequelize');
const { sequelize } = require('../database/db');
const db=require('../database/db');


module.exports=db.sequelize.define(
    'user',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        username:{
            type:Sequelize.STRING(30)
        },
        email:{
            type:Sequelize.STRING(30)
        },
        password:{
            type:Sequelize.STRING(10)
        },
        mobile:{
            type:Sequelize.STRING(12)
        },
        created:{
            type:Sequelize.DATE,
            defaultValue:Sequelize.NOW
        }
    },
    {
        timestamps:true
    }
)

sequelize.sync({ force: false }).then(function () {
    console.log('employee table created');``
  }).catch(function (err) {
    console.error('Error while creating employee table', err);
});


