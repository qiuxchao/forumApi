// Post 帖子模块

// 引入数据库连接
const db = require('../db');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const Model = Sequelize.Model;
const User = require('./User');
// 格式化时间库
const moment = require('moment');
 
// 对表建模
class Post extends Model { }
Post.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.STRING
    },
    user_id: {
        type: Sequelize.INTEGER
    },
    state: {
        type: Sequelize.INTEGER
    },
    like: {
        type: Sequelize.INTEGER
    },
    page_view: {
        type: Sequelize.INTEGER
    },
    comments: {
        type: Sequelize.INTEGER
    },
    collect: {
        type: Sequelize.INTEGER
    },
    classify: {
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
    modelName: 'posts',
    freezeTableName: true
})

// Post 表与 User 表根据 user_id 关联查询
Post.belongsTo(User, {foreignKey: 'user_id'});




module.exports = Post;