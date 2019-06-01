/*var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
 
app.get('/', function(req, res){
    res.send('<h1>Welcome Realtime Server</h1>');
});
 
http.listen(3000, function(){
    console.log('listening on *:3000');
});*/


const socket = require("socket.io");
//创建一个websocket服务器
let socketServer = socket.listen(require("http").createServer((req,resp) => {
    //返回页面
    //resp.end(require("fs").readFileSync("./socketIOTest1.html"));
}).listen(9001,"192.168.1.106",() => {console.log("listening");}));

//创建一个用于放置用户对象的map
let map = new Map();
//用于记录用户数量的变量,并初始化为0
let userCount = 0;

//目前连接数
let lineCount = 0;

//监听connection 事件
socketServer.on("connection",socket => {
    console.log("有一用户连接");
    map.set(++userCount,socket);
    lineCount = lineCount + 1;
    console.log(lineCount);
    map.forEach((value,index,arr) => {
        
        value.send(JSON.stringify({'linecount':lineCount}));

    });
    //监听客户端来的信息
    socket.on("message",msg => {
        //从客户端接收的消息
        //遍历所有用户
        console.log("客户端接受到:" + msg);

        let sendata = {
            msg : msg,
            //linecount : lineCount
        }

        map.forEach((value,index,arr) => {

            value.send(JSON.stringify(sendata));

        });
    });
    //监听客户端退出情况
    socket.on("disconnect",() => {
        console.log("有一用户退出连接");
        lineCount = (lineCount - 1) >= 1 ? (lineCount - 1) : 0;
        console.log(lineCount);
        if(lineCount){
            map.forEach((value,index,arr) => {

                value.send(JSON.stringify({'linecount':lineCount}));
    
            });
        }
    });
}); 