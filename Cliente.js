var net = require('net');
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var nameUser;
var nick;
var PORT = 9000;
var HOST = '127.0.0.1';

//var serv = require('./Servidor');

// The server is in our same machine.
var client = net.connect(PORT,HOST,function() {
	console.log('Client connected');
	rl.question("What is your name? ", function(answer) {
		nick = answer;
    	var msg = nick + " has joined to the chat";
    	console_out('Welcome, '+nick);
    	console_out('If you need help, type the command /help');
    	//var reg = "/"+nick;
    	client.write(msg+"\n");
    	rl.setPrompt(nick+"> ", nick.length+2);
    	rl.prompt(true);
	});
});

function console_out(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    rl.prompt(true);
}

rl.on('line', function (line) {
	line = line.toLowerCase();
    if (line[0] == "/" && line.length > 1) {
        var cmd = line.match(/[a-z]+\b/)[0];
        var arg = line.substr(cmd.length+2, line.length);
        chat_command(cmd, arg);
 
    } else {
        if(line != "") {
        	client.write(nick+": "+line);
        	rl.prompt(true);
        }
        rl.prompt(true);
    }
});

function chat_command(command, argument) {
	switch(command) {
		case 'date':
			client.write('date');
		break;

		case 'users':
			client.write('users');
		break;
		case 'help':
			console_out("--------------------------User's manual-----------------------------");
			console_out(' /date : This command returns the current date.					');
			console_out(' /users : This command returns the current number of users.		');
			console_out(' /name + string : This command allows the user to change his name.	');
			console_out(' /exit : Ends the chat client.										');
			console_out(' /clear : Cleans the screen.									    ');
			console_out("--------------------------------------------------------------------")
		break;
		case 'name':
			if (argument === "") {
				console_out('We need your new name.');
				console_out('Syntax: /name newName');
				break;
			};
			var nName = nick + " has changed his name to " + argument;
			client.write(nName);
			nick = argument;
			rl.setPrompt(nick+"> ", nick.length+2);
			rl.prompt(true);
			break;
		case 'clear':
				clear();
			break;
		case 'exit':
			client.write(nick + " has left the chat");
        	process.exit(0);
		default:
			console_out('Invalid command');
	}
}

function clear() {
  	process.stdout.write('\033c');
    rl.prompt(true);
}
 
client.on('data', function(data) {
	console_out(data.toString());
});