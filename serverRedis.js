var redis = require('redis');
var client = redis.createClient(6379,'127.0.0.1');
client.on('connect', function() {
    console.log('connected');
    console.log('连接redis成功');
});

const io = require('socket.io-client');
let socket = io.connect('ws://192.168.1.106:9001');
console.log('连接服务器成功')
//发送消息
/*send.onclick = () => {
    let msg = write.value;
    // content.innerHTML = content.value + msg + "\n";
    socket.send(msg);
};*/

var checkcount = 0;

//获取redis内容
var checkredis = () => {
    //console.log('查询中...');
    //let msg =Math.ceil(Math.random()*10);
    //socket.send(msg);
    //
    
    var vid= parseInt(Math.random()*(32-25) + 25);
    //var vid= 27;

    client.rpush('verify_id',vid,function(err,res){
        if(err){
            console.log(err);
        } else{
        }
    })

    console.log(client.lindex('verify_id',0))
    client.lrange('verify_id', 0, -1, function(err, reply) {
        console.log('11err = ' + err); 
        console.log('22reply = '); 
        console.log(reply); 

        checkcount = checkcount + 1;

        if(reply.length){
            //var varify_user_log = client.lindex('varify_user_log',1);
            //client.lpop('varify_user_log');//消去第一个
            let varify_user_log = null;
            //获取第一个后消去第一个
            client.lpop('verify_id',function(err, reply) {
                console.log('33err = ' + err); //元素
                console.log('44reply = '); //元素
                console.log(reply); //元素
                varify_user_log = JSON.parse(reply)
                //varify_user_log = (reply)
                if(varify_user_log != null){
                    console.log(5555555)
                    console.log(varify_user_log); //元素
                    socket.send(varify_user_log);
                } 
                console.log('新数据：' + checkcount)
            }); 
            
            varify_user_log = null;
        }else{
            console.log('暂无新数据：' + checkcount)
        }        
        
    });
}

//初始化运行获取内容
var autoCheckRides = null;

//接收到消息
socket.on("message",msg => {
    console.log("从服务器接收到的消息 ： " );
    
    let msgt = JSON.parse(msg)
    console.log(msgt)
    //更新内容
    if(msgt.hasOwnProperty('linecount')){
        if(msgt.linecount > 1 ){
            console.log('msg.linecount', JSON.parse(msg).linecount);
            console.log('判断有人连接开始启动自动');
            clearInterval(autoCheckRides); 
            autoCheckRides = setInterval(checkredis, 3000)
        }else{
            console.log('判断没人连接自动关闭');
            clearInterval(autoCheckRides); 
            checkcount = 0;
        }
    }   
  
});

//断开
socket.on("disconnect",() => {
    console.log("与服务器断开连接");
    console.log("关闭自动器");
    clearInterval(autoCheckRides); 
    checkcount = 0;
});

//重连时重新获取
socket.on('reconnect', (timeout) => {
    console.log("尝试重新连接");
    console.log("重新连接自动器");
    clearInterval(autoCheckRides); 
    autoCheckRides = setInterval(checkredis, 3000);
});

//setInterval(callback, delay, [arg], [...])
    //计划每隔 delay 毫秒之后重复执行 callback。返回一个 intervalObject 以供 clearInterval() 在有需要的时候使用。可选地，你也可以传递参数给回调函数。
//clearInterval(intervalObject)