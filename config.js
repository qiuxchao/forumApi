// 配置文件

const os = require('os');
// 获取本机 ip
// const address = os.networkInterfaces().WLAN[0].address;
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

module.exports = {
    // ip
    ip: getIPAdress(),
    // 根路由
    baseUrl: `http://${this.ip}:5000`,
    // 用户头像存放文件目录
    avatarPath: './static/uploads/avatars/',
    // 用户头像读取文件目录
    avatarNetworkPath: `http://${getIPAdress()}:5000/public/uploads/avatars/`,

}






