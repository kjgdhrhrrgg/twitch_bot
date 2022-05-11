const tmi = require('tmi.js');
require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const commands = {
	mmr: {
		response: `Meine MMR:  ${getMMR('kjgdhrhrrgg')}`
	},
	mmr2: {
		response: (argument) => `mmr von ${argument} steht hier irgendwann`
	},
	rank: {
		response: (argument) => `mmr von ${argument} steht hier irgendwann`
	},
	gang: {
		response: `187!!!!!!`
	},
	garo: {
		response: `Garo go Bronze!`
	},
	galexy: {
		response: `Chill vibes only `
	},
	test: {
		response: getMMR("kjgdhrhrrgg")
	}
}

function getMMR(argument) {
	switch(argument) {
		case "kjgdhrhrrgg":
			id = "23425";
			break;
		case "kjg":
			id = "23425";
			break;
		case "crossbell":
			id = "27015";
			break;
		default:
			id = "23425";
	}
	const url = 'https://www.mk8dx-lounge.com/PlayerDetails/';
	var xhr = new XMLHttpRequest();
	var data7 = "";
	xhr.open("GET", url+id, true);
	xhr.responseType = "document";
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var data3 = xhr.responseText.substring(xhr.responseText.indexOf("MMR</dt>"), xhr.responseText.indexOf("Peak"));
			var data4 = data3.split("dd");
			data7 = data4[1].substring(data4[1].indexOf(">")+1, data4[1].indexOf("<"));
			console.log(data7);
		}
	};
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
	}
	xhr.send();
	return data7;
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
		'kjgdhrhrrgg', 'DarkGaro', 'SheGalexy'
	]
});

client.on('message', async (channel, context, message) => {
	
	
	const isNotBot = context.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME.toLowerCase();
	
	if (!isNotBot) return;

	const [raw, command, argument] = message.match(regexpCommand);

	const { response } = commands[command] || {};

	if (typeof response === 'function') {
		client.say(channel, response(argument));
	} else if (typeof response === 'string'){
		client.say(channel, response)
	}
});
client.connect();
