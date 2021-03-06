// 帖子路由接口
const express = require('express');
// 引入用户表模型
const User = require('../model/User');
// 引入帖子表模型
const Post = require('../model/Post');
// 引入加密模块
const bcript = require('bcryptjs');
// 引入文件上传模块
const multer = require('multer');
// 引入路径模块
const path = require('path');
// 引入配置文件
const config = require('../config');
// 引入 fs 文件模块
const fs = require('fs');

// 定义子路由
const post = express.Router();



// 路由列表
post.post('/', (req, res) => {
    console.log(req.body);
    res.send('post is works');
});


// 分页获取全部帖子列表     /api/post/allPosts
// 方法：POST
// 参数：
// currentPage: Number -> 第几页
// pageSize: Number -> 每页几条
post.post('/allPosts', (req, res) => {
    console.log('分页查询帖子列表：', req.body);
    let body = req.body;
    if (!body.currentPage || !body.pageSize) {
        res.send({
            status: 500,
            msg: '缺少必要参数 currentPage | pageSize',
            data: null,
            timestamp: Date.now()
        });
        return;
    } else {
        Post.findAndCountAll({
            where: { state: 2 },   // 查询审核通过的
            offset: parseInt(body.currentPage), // 第几页
            limit: parseInt(body.pageSize),     // 每页数据数量
            distinct: true,      // 去重
            order: [['created', 'DESC']], // 排序
            include: [{ // include关键字表示关联查询
                model: User, // 指定关联的model
                attributes: ['nick_name', 'avatar'], // 这里的attributes属性表示查询users表的name和rank字段，其中对name字段起了别名className
            }]
        }).then(result => {
            if (result) {
                res.send({
                    status: 200,
                    msg: '获取帖子列表成功',
                    data: result,
                    timestamp: Date.now()
                });
                return;
            } else {
                res.send({
                    status: 200,
                    msg: '获取帖子列表失败',
                    data: null,
                    timestamp: Date.now()
                });
                return;
            }
        }).catch(err => {
            res.send({
                status: 500,
                msg: err,
                data: null,
                timestamp: Date.now()
            });
            return;
        });
    }
});


// 发布帖子     /api/post/publicPost
// 方法：POST
// 参数(均为必填)：
// title: String -> 帖子标题
// description: String -> 帖子描述
// content: String -> 帖子内容
// userId: Number -> 作者 id
// classify: String -> 帖子分类
post.post('/publicPost', (req, res) => {
    console.log('上传帖子：', req.body);
    let body = req.body;
    if (!body.title || !body.description || !body.content || !body.userId || !body.classify) {
        res.send({
            status: 500,
            msg: '缺少必要参数 title | description | content | userId | classify',
            data: null,
            timestamp: Date.now()
        });
        return;
    } else {
        // 去用户表查询是否存在该用户
        User.findOne({ where: { id: body.userId } })
            .then(result => {
                if (!result) {
                    res.send({
                        status: 500,
                        msg: '用户不存在',
                        data: null,
                        timestamp: Date.now()
                    });
                    return;
                } else {
                    // 用户存在，插入帖子数据
                    let data = {
                        title: body.title,
                        description: body.description,
                        content: body.content,
                        user_id: Number(body.userId),
                        state: 1,
                        classify: body.classify
                    };
                    Post.create(data)
                        .then(result2 => {
                            if (result2) {
                                res.send({
                                    status: 200,
                                    msg: '发布成功，待审核',
                                    data: result2,
                                    timestamp: Date.now()
                                });
                                return;
                            } else {
                                res.send({
                                    status: 500,
                                    msg: '发布失败',
                                    data: null,
                                    timestamp: Date.now()
                                });
                                return;
                            }
                        }).catch(err => {
                            res.send({
                                status: 500,
                                msg: err,
                                data: '这里出错',
                                timestamp: Date.now()
                            });
                            return;
                        });
                }
            }).catch(err => {
                res.send({
                    status: 500,
                    msg: err,
                    data: null,
                    timestamp: Date.now()
                });
                return;
            });
    }
})


// 根据帖子id获取单个帖子的数据     /api/post/singlePost
// 方法：POST
// 参数：
// id: 帖子id -> Number
post.post('/singlePost', (req, res) => {
    console.log('根据id查单条帖子：', req.body);
    if (!req.body.id) {
        res.send({
            status: 500,
            msg: '缺少必要参数 id',
            data: null,
            timestamp: Date.now()
        });
        return;
    } else {
        Post.findOne({ where: { id: req.body.id } })
            .then(result => {
                if (result) {
                    // 将帖子的浏览量+1
                    pageView = result.page_view ? result.page_view + 1 : 1;
                    Post.update({ page_view: pageView }, { where: { id: req.body.id } })
                        .then(result2 => {
                            if (result2) {
                                Post.findOne({ where: { id: req.body.id } })
                                    .then(result3 => {
                                        if (result3) {
                                            res.send({
                                                status: 200,
                                                msg: '查询帖子成功',
                                                data: result3,
                                                timestamp: Date.now()
                                            });
                                            return;
                                        } else {
                                            res.send({
                                                status: 200,
                                                msg: '查询帖子成功',
                                                data: result,
                                                timestamp: Date.now()
                                            });
                                            return;
                                        }
                                    }).catch(err => {
                                        res.send({
                                            status: 500,
                                            msg: err,
                                            data: null,
                                            timestamp: Date.now()
                                        });
                                        return;
                                    });
                            }
                        }).catch(err => {
                            res.send({
                                status: 500,
                                msg: err,
                                data: null,
                                timestamp: Date.now()
                            });
                            return;
                        });
                } else {
                    res.send({
                        status: 500,
                        msg: '帖子不存在',
                        data: null,
                        timestamp: Date.now()
                    });
                    return;
                }
            }).catch(err => {
                res.send({
                    status: 500,
                    msg: err,
                    data: null,
                    timestamp: Date.now()
                });
                return;
            })
    }
});






// 导出子路由
module.exports = post;