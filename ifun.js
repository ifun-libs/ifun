var cp = require("child_process");

//spawn封装
exports.spawn = function(cmdExp, callback) {
    var args = cmdExp;
    if(typeof args=="string") {
        args = args.split(/\s+/);
    }
    var cmd = args.shift();
    if(cmd=="npm" && process.platform=="win32"){
        cmd = "npm.cmd"
    }
    var sp = cp.spawn(cmd, args, {stdio:"inherit"});
    sp.on("data", (data)=>{
        console.log("error:",data.toString());
    });
    callback && sp.on('close', function(code){
        callback(code!==0);
    });
};

//同步执行
exports.cmd = function(cmdExp){
    return cp.execSync(cmdExp).toString().trim();
};

//提示
exports.log = function(message){
    console.log(message);
};

//提示并退出
exports.end = function(message){
    message && console.log(message);
    process.exit();
};

//获取当前分支
exports.getCurrentBranch = function() {
    try {
        return cp.execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    } catch (e) {
        return null;
    }
};


//获取本地IP
exports.getLocalIp = function(){
    var ret = [];
    try{
        var ips = os.networkInterfaces();
        for(var k in ips) {
            var a = ips[k];
            for (var j = 0; j < a.length; j++) {
                var o = a[j];
                if (o.family == "IPv4" && o.internal === false) {
                    ret.push(o.address);
                }
            }
        }

    }catch(e){}
    return ret.join("/") || "localhost";
};

//获取参数列表
exports.getArgs = function() {
    var argv = process.argv.slice(2);
    var args = {};
    args.more = [];

    argv.forEach(function(kv){
        kv = kv.split("=");
        var k = kv[0];
        var v = kv[1];
        if(kv.length==2){
            if(/\./.test(k)) {
                exports.parseDot(args,k.split("."),v);
            }else{
                args[k] = v;
            }
        }else if(/^\-\-(\w+)$/.test(k)){
            args[RegExp.$1] = true;
        }else if(/^\-(\w+)$/.test(k)){
            RegExp.$1.split("").forEach(function(k2){
                args[k2] = true;
            });
        }else{
            args.more.push(k);
        }
    });
    return args;
};

//解析多个.相隔开的key
exports.parseDot = function(args, kk, v){
    var k = kk.shift();
    if(kk.length>0){
        args[k] = args[k] || {};
        exports.parseDot(args[k],kk,v);
    }else{
        args[k] = v;
    }
};