// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Todo = sequelize.define('Todo', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     description: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     },
//     completed: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false
//     }
// }, {
//     timestamps: true
// });

// module.exports = Todo; 

// models/Todo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Todo = sequelize.define('Todo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    userId: { // 🔑 Foreign key
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'CASCADE' // Optional: if you want todos deleted when user is deleted
    }
}, {
    timestamps: true
});

module.exports = Todo;
