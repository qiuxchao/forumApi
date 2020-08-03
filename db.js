// 数据库连接
const Sequelize = require('sequelize');
const db = {};

// 创建数据库实例
const sequelize = new Sequelize('forum', 'root', '', {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        charset: 'utf8',    // 字符集
        acquire: 'utf8_general_ci', // 排序规则
        timestamps: false,          // 禁止自动创建时间戳字段
    },
    timezone: '+08:00'      // 时区
});

// 将数据库实例绑定到 db 对象上
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;








