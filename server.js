const tmi = require('tmi.js');
require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


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
	var rank = "";
	if (getMMR(argument) == "Player not found.") {
		rank = getMMR(argument);
	}
	else {
		var mmr = parseInt(getMMR(argument));
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
		case "foerbs7":
			id = "21372";
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
