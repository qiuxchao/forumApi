// 配置文件

const os = require('os');
// 获取本机 ip
const address = os.networkInterfaces().WLAN[0].address;

module.exports = {
    // 根路由
    baseUrl: `http://${address}:5000`,
    // 用户头像存放文件目录
    avatarPath: './static/uploads/avatars/',
    // 用户头像读取文件目录
    avatarNetworkPath: '/public/uploads/avatars/',

}






