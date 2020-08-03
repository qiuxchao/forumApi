const express = require('express');
const bodyParser = require('body-parser');
// 引入用户接口路由
const user = require('./routes/User');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/user', user);



app.get('/', (req, res) => {
    res.send('Server Is Works!');
});

const port = process.env.PORT || '5000';
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));







