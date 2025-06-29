const User = require('./User');
const Todo = require('./Todo');
const Role = require('./Role');
const UserRole = require('./UserRole');
const File = require('./File');

// User-Todo relationship (one-to-many)
User.hasMany(Todo, {
    foreignKey: 'userId',
    as: 'todos'
});

Todo.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// User-File relationship (one-to-many)
User.hasMany(File, {
    foreignKey: 'uploadedBy',
    as: 'files'
});

File.belongsTo(User, {
    foreignKey: 'uploadedBy',
    as: 'uploader'
});

// User-Role relationship (many-to-many)
User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'userId',
    otherKey: 'roleId',
    as: 'roles'
});

Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'roleId',
    otherKey: 'userId',
    as: 'users'
});

module.exports = {
    User,
    Todo,
    Role,
    UserRole,
    File
}; 