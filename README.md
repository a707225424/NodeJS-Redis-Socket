# NodeJS-Redis-Socket
node + redis + socket 配置简单的web通讯服务

全局通讯，无私聊功能

通过定时器读取redis中指定数据 进行提交服务

========================
npm install

需要到socket redis依赖

运行服务器
node serverRedis.js

运行定时客户端
node serverSocket.js

其他普通客户端可自行添加，只有接收服务就可以了
