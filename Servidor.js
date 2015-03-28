/*************************************************************************
 *  Execution: nodejs Servidor.js
 *
 *  Author: Semproms
 *
 *************************************************************************/

var net = require('net');
var clients = [];
var numC = 0;
var dirIP;
var port = 9000;

net.createServer(function(socket){
 
	socket.name = socket.remoteAddress + ":" + socket.remotePort;
	clients.push(socket);

  numC++;
  console.log('Clients online: '+numC);
	broadcast("\n"+socket.name + ' joined to the chat\n', socket);

 function getDate() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

	socket.on('data', function (data) {
      if (data.toString() === 'users') {
        socket.write("Current number of users: "+numC.toString());
      }
      else if(data.toString() === 'date') {
        socket.write(getDate().toString());
      }
    	else broadcast(data, socket);
  	});

	socket.on('end', function () {
    	clients.splice(clients.indexOf(socket), 1);
      clients.forEach(function(client){
        if (client === socket) {
          client = "";
        }
      });
      numC--;
  });

	function broadcast(message, sender) {
    	clients.forEach(function (client) {
      	if (client === sender) return;
      	client.write(message);
    	});
    	process.stdout.write(getDate()+" "+message+" with address: "+sender.remoteAddress+"\n");
  }


}).listen(port);

console.log("Chat server running at port: "+port+"\n");