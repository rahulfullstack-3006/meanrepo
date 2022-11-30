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
        age:{
            type:Sequelize.STRING(30)
        },
        standard:{
            type:Sequelize.STRING(30)
        },
        password:{
            type:Sequelize.STRING(255)
        },
        token:{
            type:Sequelize.STRING(1000)
        },
        // image:{
        //     type:Sequelize.STRING(1000)
        // },
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
    console.log('employee table created');
    // sequelize.addColumn('users', 'image', { type: Sequelize.STRING });
  }).catch(function (err) {
    console.error('Error while creating employee table', err);
});


