const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserTodo = sequelize.define('UserTodo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    todoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Todos',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'todoId']
        }
    ]
});

module.exports = UserTodo; 