/**
 * Created by Wilson on 9/29/16.
 */
function getDateTime() {
    //get the time and date, will be added to
    var now     = new Date();
    var year    = now.getFullYear();
    var month   = now.getMonth()+1;
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds();
    //correct the numbers to two digits
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }
    var date = month+ " " + day;
    var time = hour+':'+minute+':'+second;
    return [date, time];;
}

var app = require('express')();
var express=require('express');

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'tian9415',
    database : 'ec544'
});
connection.connect();
var SerialPort = require('serialport');


var http = require('http').Server(app);
var io = require('socket.io')(http);
var inString;
var sum = 0.00;
var i = 1;
var excStr = "temperature exception!";
var f = new Array(3);
var tmp = new Array(3);
tmp[0] = 0.00;
tmp[1] = 0.00;
tmp[2] = 0.00;
f[0] = 1;
f[1] = 1;
f[2] = 1;


var portName = process.argv[2],
    portConfig = {
        baudRate: 9600,
        parser: SerialPort.parsers.readline("\n")
    };

var sp;

sp = new SerialPort.SerialPort(portName, portConfig);
app.use('/', express.static(__dirname + '/'));

app.get('/', function(req, res){
    res.sendfile('index.html');
});



io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        sp.write(msg + "\n");
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

sp.on("open", function () {
    console.log('open');
    sp.on('data', function(data) {
        console.log('data received: ' + data);  //capture the messgae in serialport
        var timenow = getDateTime();
        var temp = new Number((parseFloat)(data));
        var index = parseInt(temp/100);
        if (f[index]==0.00)
        {
            var cnt = 0;
            var sum = 0.00;
            for (var i=0; i<3; i++)
            {
                if (tmp[i]!=0.00)
                {
                    cnt++;
                    sum+=tmp[i];
                }
            }
            sum/=cnt;
            for(var k=0;k<3;k++)
            {
            io.emit("chat message", (k+1) + "Temperature:" + tmp[k].toFixed(2).toString());
            }
            io.emit("chat message", "Average Temperature:" + sum.toFixed(2).toString());

         var data = {
            Date: timenow[0],
            Time: timenow[1],
            T_Router1: tmp[0],
            T_Router2: tmp[1],
            T_Router3: tmp[2],
            AVG_T: sum
            };

        connection.query('INSERT INTO temperature set ?',data, function(err, result) {
            if(err){
                console.error(err);
                return;
            }
            console.error(result);
        });
            for (var i=0; i<3; i++)
            {
                f[i] = 1;
                tmp[i] = 0.00;
            }
        }
        tmp[index] = temp%100 + 0.00;
//        io.emit("chat message", (index+1) + "Temperature:" + tmp[index]);
        f[index]--;




        // -- io.emit("chat message", "Temperature: " + data);
        // -- if (temp > 80 || temp < 30) {
        // --   io.emit("chat message", "Warning: temperature exception!");
        // --   flag++;
        // --   temp = 0;
        // -- }
        // -- sum += temp;  // accumulate temperature of each sensors

        // -- while(i==3){   //calculate the average Temperature
        // --     sum = sum / (3 - flag);

        // --     var num = new Number(sum);
        // --     io.emit("chat message", "Average Temperature: " + num.toFixed(2).toString());  //keep two digits of the average temp
        // --     i=0;
        // --     sum = 0.00;
        // -- }
        // -- i++;
    });
});