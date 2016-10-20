var Particle = require('particle-api-js');
var particle = new Particle();

var token='ce9876476eed9c3bb60dc10738307614c922cf4f';
var d_uid1='350042001547353236343033';
var d_uid2='230044001547353236343033';
var d_uid3='230030001547353236343033';
var d_uid4='3a0022001647353236343033';
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

timer1 = setInterval(talk_with_photon,3000); //start reading.



function talk_with_photon() {
    // g_var(d_uid2, token);
    //     //
    //     g_var(d_uid1, token);
    //     g_var(d_uid3, token);
    g_var(d_uid4 , token);
}

function g_var(d_id,l_token){

    if (d_id == '3a0022001647353236343033'){
    particle.getVariable({ deviceId: d_id, name: 'temperature', auth: l_token }).then(
        function (data) {
            io.emit("chat message", "1Temperature:" + data.body.result.toFixed(2).toString());
            console.log('1 Temperature: ', data.body.result.toFixed(2).toString());
        }, function (err) {
            console.log('An error occurred while getting attrs:', err);
        });
    }
    // else if (d_id == '230044001547353236343033'){
    //     particle.getVariable({ deviceId: d_id, name: 'temperature', auth: l_token }).then(
    //         function (data) {
    //             io.emit("chat message", "2Temperature:" + data.body.result.toFixed(2).toString());
    //             console.log('2 Temperature: ', data.body.result.toFixed(2).toString());
    //
    //         }, function (err) {
    //             console.log('An error occurred while getting attrs:', err);
    //         });
    // }
    // else if (d_id == '230030001547353236343033'){
    //     particle.getVariable({ deviceId: d_id, name: 'temperature', auth: l_token }).then(
    //         function (data) {
    //             io.emit("chat message", "3Temperature:" + data.body.result.toFixed(2).toString());
    //             console.log('3 Temperature: ', data.body.result.toFixed(2).toString());
    //         }, function (err) {
    //             console.log('An error occurred while getting attrs:', err);
    //         });
    // }

}



/**
 * Created by Wilson on 9/29/16.
 */
