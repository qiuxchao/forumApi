// User 模块


// 引入数据库连接
const db = require('../db');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const Model = Sequelize.Model;
// 格式化时间库
const moment = require('moment');

// 对表建模
class User extends Model { }
User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_name: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    avatar: {
        type: Sequelize.STRING
    },
    nick_name: {
        type: Sequelize.STRING
    },
    age: {
        type: Sequelize.INTEGER
    },
    sex: {
        type: Sequelize.INTEGER
    },
    signature: {
        type: Sequelize.STRING
    },
    qq: {
        type: Sequelize.STRING
    },
    wechat: {
        type: Sequelize.STRING
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        get() {
            return moment(this.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    updated: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('updated')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
}, {
    sequelize,
    modelName: 'users',
    freezeTableName: true
});

// 将表与模型同步，该操作会覆盖数据库中的表
// User.sync({ force: true });

module.exports = User;


















