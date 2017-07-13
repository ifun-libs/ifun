/**
 * Created by likaituan on 03/03/2017.
 */

var mongodb = require("mongodb").MongoClient;
var isFirst = true;
var DB;

var ops = {
	username: '',
	password: '',
	host: 'localhost',
	port: 27017,
	database: 'test'
};
exports.config = function (options){
    Object.assign(ops, options);
};

// 连接
exports.connect = function () {
    var auth = ops.username && ops.password && `${ops.username}:${ops.password}@` || '';
    var connectStr = `mongodb://${auth}${ops.host}:${ops.port}/${ops.database}`;
    return mongodb.connect(connectStr).then(
        db => {
            if (isFirst) {
                isFirst = false;
                console.log(`MongoDB Is Running At ${host}:${port} by ${dbName}`);
            }
            DB = db;
            return Promise.resolve(db);
        },
        err => {
            console.log(err);
            // console.log(err.message);
            //console.log(`warning: your mongodb server was not installed or not started, please input 'mongod' to run in command line`);
            return Promise.reject(err);
        }
    );
};

// 断开连接
Promise.prototype.close = function(){
    return this.then(
        data => {
            DB && DB.close();
            return Promise.resolve(data);
        },
        err => {
            DB && DB.close();
            return Promise.reject(err);
        }
    );
};
