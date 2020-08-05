const express = require('express');
const bodyParser = require('body-parser');
// 引入用户接口路由
const user = require('./routes/User');
// 引入帖子接口路由
const post = require('./routes/Post');

const app = express();

//设置允许跨域访问该服务.
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    // res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

// 设置请求体解析
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// 设置静态资源
app.use('/public', express.static('./static'));
// 设置子路由
app.use('/api/user', user);
app.use('/api/post', post);


app.get('/', (req, res) => {
    res.send('Server Is Works!');
});

const port = process.env.PORT || '5000';
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));







