// 用户接口路由
const express = require('express');
// 引入用户表模型
const User = require('../model/User');
// 引入加密模块
const bcript = require('bcryptjs');
// 引入文件上传模块
const multer = require('multer');
// 引入路径模块
const path = require('path');
// 引入配置文件
const config = require('../config');

const user = express.Router();


// 设置磁盘存储引擎（multer 模块）
const storage = multer.diskStorage({
    // 每个函数都传递了请求对象 (req) 和一些关于这个文件的信息 (file)，还有一个回调函数(cb)
    // destination() 是用来确定上传的文件应该存储在哪个文件夹中。
    // 也可以提供一个 string(例如 '/tmp/uploads') 。如果没有设置 destination，则使用操作系统默认的临时文件夹。
    destination(req, file, cb) {
        // 指定上传的文件存储在哪个文件夹下
        cb(null, config.avatarPath);
    },
    // filename() 用于确定文件夹中的文件名的确定。 如果没有设置 filename，每个文件将设置为一个随机文件名，并且是没有扩展名的。
    // 所以必须设置文件的扩展名，可以从第二个参数 file 的 originalname 属性中得到完整的文件名（带有扩展名的）
    // 然后再使用 path.extname() 方法获取到扩展名，最后拼接到自定义的文件名即可。
    filename(req, file, cb) {
        console.log(file);
        // 通过将文件名 + 时间戳 + 原始文件的扩展名 得到一个独一无二的文件名称，用于存储到 ../uploads/
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// 验证文件类型（过滤函数）
const checkFileType = (file, cb) => {
    // 允许的文件扩展名格式
    const filetypes = /jpeg|jpg|png|gif|webp/;
    // 验证文件的扩展名
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // 验证minetype文件格式
    const mimetype = filetypes.test(file.mimetype);
    // 如果以上 extname 和 mimetype 都为 true ，就符合上传图片的文件格式
    if (extname && mimetype) {
        // 此文件符合图片类型的规则，返回到回调函数中
        return cb(null, true);
    } else {
        // 此文件不符合图片类型的规则，返回错误信息到回调函数中
        // 此错误信息将会传入到 upload 的第三个参数回调函数的参数 err 中，下面已经对这个 err 做了处理
        cb('错误：只支持jpeg|jpg|png|gif|webp图片格式');
    }
}

// 初始化 upload 上传设置，参数为一个对象，storeage 指定存储方式为磁盘存储
// single() 的参数指定了上传文件时的属性
const upload = multer({
    storage: storage,
    // fileFilter() 过滤上传的文件，控制什么文件可以上传以及什么文件应该跳过
    fileFilter(req, file, cb) {
        // 调用 checkFileType 函数来通过扩展名判断文件的类型
        checkFileType(file, cb);
    },
    // limits 一个对象，指定一些数据大小的限制
    limits: { fileSize: 1000000 }
}).single('avatar');



// 路由接口列表：
user.get('/', (req, res) => {
    res.send('user api is works...');
});

// 注册接口     /api/user/register
// 方法：POST
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
                } else {
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
                }
            });
    } else {
        res.send({
            status: 500,
            msg: '缺少必要的参数 userName 或 password!',
            data: null,
            timestamp: Date.now()
        });
    }
});


// 登录接口     /api/user/login
// 方法：POST
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


// 修改用户信息接口     /api/user/update
// 方法：POST
// 参数，都是可选的：
// id: 用户 id
// password: 密码
// nick_name: 昵称
// age: 年龄
// sex: 性别
// signature: 签名
// qq: qq号
// wechat: 微信号
user.post('/update', (req, res) => {
    res.send('user update api');
});


// 上传用户头像
// 方法：POST
// 表单类型("multipart/form-data")
// 参数：
// id：用户id
// avatar: 头像图片，
user.post('/uploadAvatar', (req, res) => {
    console.log('上传头像表单数据：', req.query);
    // 没有传用户id
    // res.send({
    //     status: 500,
    //     msg: '缺少必要参数 id',
    //     data: null,
    //     timestamp: Date.now()
    // });
    // return;
    // 验证用户id
    User.findOne({ where: { id: req.query.id } })
        .then(result => {
            if (!result) {
                // 用户id无效
                res.send({
                    status: 500,
                    msg: '无效的用户id',
                    data: null,
                    timestamp: Date.now()
                });
                return;
            } else {
                // 有此用户，保存图片
                upload(req, res, (err) => {
                    if (err) {
                        // 该报错信息由过滤函数 checkFileType 或 limits所返回
                        res.send({
                            status: 500,
                            msg: err,
                            data: null,
                            timestamp: Date.now()
                        });
                        return;
                    } else {
                        // 一切正常，获取上传的图片文件，图片信息都在 req.file 中
                        if (!req.file) {
                            // 用户没有上传文件而直接点击了提交
                            res.send({
                                status: 500,
                                msg: '未上传任何图片',
                                data: null,
                                timestamp: Date.now()
                            });
                        } else {
                            // 用户选择了文件并点击了提交，已经保存了文件
                            // 将文件路径存到数据库然后返回给前端
                            User.update({ avatar: config.avatarPath + req.file.filename }, { where: { id: req.query.id } })
                                .then(result => {
                                    if (result) {
                                        res.send({
                                            status: 200,
                                            msg: '上传成功',
                                            data: result,
                                            timestamp: Date.now()
                                        });
                                    }
                                })
                        }
                    }
                });
            }
        })


});


// 注销用户
// 方法：POST
// 参数：
// id: 用户id
user.post('/delete', (req, res) => {
    res.send('user delete api');
});




// 导出用户接口路由
module.exports = user;









