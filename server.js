const express = require('express');
const bodyParser = require('body-parser');
// 引入用户接口路由
const user = require('./routes/User');

const app = express();

// 设置请求体解析
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// 设置静态资源
app.use('/public',express.static('./static'));
// 设置子路由
app.use('/api/user', user);



app.get('/', (req, res) => {
    res.send('Server Is Works!');
});

const port = process.env.PORT || '5000';
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));







