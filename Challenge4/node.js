var Particle = require('particle-api-js');
var particle = new Particle();


var token= 'ce9876476eed9c3bb60dc10738307614c922cf4f';
var d_uid= ['350042001547353236343033', '230030001547353236343033', '230044001547353236343033']
var timer1;
var app = require('express')();
var express=require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var inString;
var sum = 0.00;
var i = 1;
var excStr = "temperature exception!";
var f = new Array(3);
var tmp = new Array(3);

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
    });
});
//
//
http.listen(3000, function(){
    console.log('listening on *:3000');
});
var temperature = 0.00;

timer1 = setInterval(talk_with_photon, 5000);

function talk_with_photon() {
    // g_var(d_uid[0], token, tmp[0]);
    // console.log('Device variable retrieved successfully:', tmp[0])
    for(var i = 0; i < 3; i++) {
        g_var(d_uid[i], token, i);
    }
}

function g_var(d_id,l_token, i){
    particle.getVariable({ deviceId: d_id, name: 'temperature', auth: l_token }).then(
        function (data) {
            // tmp = data.body.result;
            io.emit("chat message", (i+1) + "Temperature:" + data.body.result.toFixed(2).toString());
            console.log('Device variable retrieved successfully:', temperature = data.body.result);
            store(i);
        }, function (err) {
            console.log('An error occurred while getting attrs:', err);
        });
}

/*-------------------------------------------------*/

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
    var date = month+ "-" + day;
    var time = hour+':'+minute+':'+second;
    return [date, time];;
}

function store(i) {
    var timenow = getDateTime();
    var data = {
            Date: timenow[0],
            Time: timenow[1],
            Temp: temperature,
            };
    if(i == 0) {
        var query = connection.query('INSERT INTO Photon1 SET ?', data, function(err, result) {
        if(err){
                console.error(err);
                return;
            }
            console.error(result);
    }); 
    }

    if(i == 1) {
        var query = connection.query('INSERT INTO Photon2 SET ?', data, function(err, result) {
        if(err){
                console.error(err);
                return;
            }
            console.error(result);
    }); 
    }

    
    if(i == 2) {
        var query = connection.query('INSERT INTO Photon3 SET ?', data, function(err, result) {
        if(err){
                console.error(err);
                return;
            }
            console.error(result);
    }); 
    }
}

