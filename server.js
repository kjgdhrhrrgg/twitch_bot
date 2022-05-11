const tmi = require('tmi.js');
require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const commands = {
	mmr: {
		response: (argument) => `MMR von ${argument}: ${getMMR(argument)}`
	},
	rank: {
		response: (argument) => `Rank von ${argument}: ${getRank(argument)}`
	},
	gang: {
		response: `187!!!!!!`
	},
	garo: {
		response: `Garo go Bronze!`
	},
	help:{
		response: `Ich bin ein Statsbot für 150 ccm Lounge. Mögliche Commands sind "!mmr <twitch_username>" und "!rank <twitch_username>". Falls eure ID nicht gefunden wird, meldet euch beim Botersteller, damit er euren Twitchusername mit der Loungeliste verknüpfen kann.`
	} 
	
}

function getRank(argument) {
	var mmr = parseInt(getMMR(argument));
	var rank = "";
	if (mmr > 15000) {
		rank = "Grandmaster";
	} else if (mmr < 15000 && mmr > 14000) {
		rank = "Master";
	} else if (mmr < 14000 && mmr > 12000) {
		rank = "Diamond";
	} else if (mmr < 12000 && mmr > 10000) {
		rank = "Sapphire";
	} else if (mmr < 10000 && mmr > 8000) {
		rank = "Platinum";
	} else if (mmr < 8000 && mmr > 6000) {
		rank = "Gold";
	} else if (mmr < 6000 && mmr > 4000) {
		rank = "Silver";
	} else if (mmr < 4000 && mmr > 2000) {
		rank = "Bronze";
	} else if (mmr < 2000) {
		rank = "Iron";
	}
	return rank;
}

function getMMR(argument) {
	switch(argument.toLowerCase()) {
		case "":
			id = "23425";
			break;
		case "kjgdhrhrrgg":
			id = "23425";
			break;
		case "kjg":
			id = "23425";
			break;
		case "crossbell":
			id = "27015";
			break;
		case "darkgaro":
			id = "27216";
			break;
		case "jut187":
			id = "19614";
			break;		
		case "woif_95":
			id = "24492";
			break;
		case "lennoxx187":
			id = "21083";
			break;
		case "10lea03":
			id = "23694";
			break;
		case "kathi_kqr":
			id = "22362";
			break;
		case "leonx200206":
			id = "22004";
			break;
		default:
			id = "not";
	}
	if (id != "not") {
		const url = 'https://www.mk8dx-lounge.com/PlayerDetails/';
		var data7 = "";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url+id, false);
		xhr.responseType = "document";
		
		xhr.onerror = function() {
			console.error(xhr.status, xhr.statusText);
		}
		data7 = xhr.onload = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var data3 = xhr.responseText.substring(xhr.responseText.indexOf("MMR</dt>"), xhr.responseText.indexOf("Peak"));
				var data4 = data3.split("dd");
				data7 = data4[1].substring(data4[1].indexOf(">")+1, data4[1].indexOf("<"));
			}
	
		}
		xhr.send();
	} else {
		data7 = "not found.";
	}
	
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
		'kjgdhrhrrgg', 'darkgaro'
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
