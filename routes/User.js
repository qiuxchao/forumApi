// 用户接口路由
const express = require('express');
// 引入用户表模型
const User = require('../model/User');
// 引入加密模块
const bcript = require('bcryptjs');

const user = express.Router();


user.get('/', (req, res) => {
    res.send('user api is works...');
});

// 注册接口
// 参数：
// 1. userName: 用户账号，只能是邮箱或者手机号，前端做限制
// 2. password: 用户密码
user.post('/register', (req, res) => {
    console.log('用户注册：', req.body);
    if (req.body.userName && req.body.password) {
        // 判断用户是否已经注册过
        User.findOne({ where: { user_name: req.body.userName } })
            .then(result => {
                if (result) {
                    // 已经注册过
                    res.send({
                        status: 500,
                        msg: "账号已经被注册",
                        data: null,
                        timestamp: Date.now()
                    });
                    return;
                }
            });

        // 没有被注册过，加密密码，添加新用户
        bcript.hash(req.body.password, 10, (err, hash) => {
            let password = hash;
            let obj = {
                user_name: req.body.userName,
                password: password
            };
            User.create(obj).then(result => {
                if (result) {
                    console.log(result);
                    res.send({
                        status: 200,
                        msg: '注册成功',
                        data: {
                            userName: req.body.userName,
                            password: password
                        },
                        timestamp: Date.now()
                    });
                }
            }).catch(err => {
                res.send({
                    status: 500,
                    msg: err,
                    data: null,
                    timestamp: Date.now()
                });
            });
        })
    } else {
        res.send({
            status: 500,
            msg: '缺少必要的参数 userName 或 password!',
            data: null,
            timestamp: Date.now()
        });
    }
});


// 登录接口
// 参数：
// userName: 用户账号
// password: 用户密码
user.post('/login', (req, res) => {
    console.log('用户登录：', req.body);
    if (req.body.userName && req.body.password) {
        // 判断用户是否注册过
        User.findOne({ where: { user_name: req.body.userName } })
            .then(result => {
                if (result) {
                    // 用户被注册过，判断密码是否正确
                    // 解密密码
                    if (bcript.compareSync(req.body.password, result.password)) {
                        // 密码正确
                        res.send({
                            status: 200,
                            msg: '登录成功',
                            data: result,
                            timestamp: Date.now()
                        });
                    } else {
                        // 密码错误
                        res.send({
                            status: 500,
                            msg: '密码错误',
                            data: null,
                            timestamp: Date.now()
                        });
                        return;
                    }


                } else {
                    res.send({
                        status: 500,
                        msg: '用户不存在',
                        data: null,
                        timestamp: Date.now()
                    });
                    return;
                }
            })
    } else {
        res.send({
            status: 500,
            msg: '缺少必要的参数 userName 或 password!',
            data: null,
            timestamp: Date.now()
        });
    }
});



// 导出用户接口路由
module.exports = user;









