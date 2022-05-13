const tmi = require('tmi.js');
require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const mk8_url = 'https://www.mk8dx-lounge.com/PlayerDetails/';
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const commands = {
	mmr: {
		response: (argument) => `MMR of ${argument}: ${getMMR(argument)}`
	},
	rank: {
		response: (argument) => `Rank of ${argument}: ${getRank(argument)}`
	},
	gang: {
		response: `187!!!!!!`
	},
	stats: {
		response: (argument) => `Stats of ${argument}: ${getID(argument)}`
	},
	help:{
		response: `I'm a twitch bot which can show some stats for 150 ccm Lounge. 
			Available Commands are "!mmr <twitch_username>" and "!rank <twitch_username>".
			 If your ID wasn't found, please contact the developer (twitter: @kjg_mk8dx) of this bot, so he can link your twitch username to your lounge username.`
	},
	outfit: {
		response: 'Woah another cute outfit today. Soooo cute'
	},
	twitter: {
		response: "https://twitter.com/kjg_mk8dx"
	}
	
}

function getRank(argument) {
	var playerList = data_list();
	var id = "not";
	for (var i in playerList) {
		if (argument == playerList[i][0]) {
			id = playerList[i][1];
			break
		}
	}
	if (id != "not") {
		var data7 = "";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", mk8_url+id, false);
		xhr.responseType = "document";
		
		xhr.onerror = function() {
			console.error(xhr.status, xhr.statusText);
			data7 = "Website is currenty down";
		}
		
		// Scrape Rank of the player
		
		xhr.onload = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var data3 = xhr.responseText.substring(xhr.responseText.indexOf("<h1>"), xhr.responseText.indexOf("</h1>"));
				data7 = data3.substring(data3.indexOf("- ")+2);
			}
	
		}
		xhr.send();
	} else {
		data7 = "Player not found."
	}
	return data7;
}

function getMMR(argument) {
	var playerList = data_list();
	var id = "not";
	for (var i in playerList) {
		if (argument == playerList[i][0]) {
			id = playerList[i][1];
			break
		}
	}
	if (id != "not") {
		var data7 = "";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", mk8_url+id, false);
		xhr.responseType = "document";
		
		xhr.onerror = function() {
			console.error(xhr.status, xhr.statusText);
			data7 = "Website is currenty down";
		}
		
		// Scrape MMR of the player
		
		xhr.onload = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var data3 = xhr.responseText.substring(xhr.responseText.indexOf("MMR</dt>"), xhr.responseText.indexOf("Peak"));
				var data4 = data3.split("dd");
				data7 = data4[1].substring(data4[1].indexOf(">")+1, data4[1].indexOf("<"));
			}
	
		}
		xhr.send();
	} else {
		data7 = "Player not found.";
	}
	
	return data7;
}

function getID(argument) {
	var playerList = data_list();
	for (var i in playerList) {
		if (argument == playerList[i][0]) {
			var id = playerList[i][1];
			break
		}
	}
	id = mk8_url+id;
	return id;
}
function data_list(){
	var db = [];
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://raw.githubusercontent.com/kjgdhrhrrgg/twitch_bot/master/data-list.json", false);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var test = JSON.parse(this.responseText);
			for (var i in test) {
				db.push([i,test[i]]);
			}
		}
	}
	xhr.send();
	return db;
}


const client = new tmi.Client({
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	connection: {
		reconnect: true
	},
	channels: [
		'kjgdhrhrrgg', 'darkgaro', 'crossbell', 'mariyohh'
	]
});

client.on('message', async (channel, context, message) => {
	
	
	const isNotBot = context.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME.toLowerCase();
	
	if (!isNotBot) return;
	if (message.charAt(0) != "!") return;
	
	const [raw, command, argument] = message.match(regexpCommand);
	const { response } = commands[command] || {};

	if (typeof response === 'string'){
		client.say(channel, response)
	} else if (typeof response === 'function') {
		client.say(channel, response(argument));
	}  
});
client.connect();
