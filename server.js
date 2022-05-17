const tmi = require('tmi.js');
require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const mk8_url = 'https://www.mk8dx-lounge.com/PlayerDetails/';
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const commands = {
	mmr: {
		response: (context, argument) => `${getMMR(context, argument)}`
	},
	rank: {
		response: (context, argument) => `${getRank(context, argument)}`
	},
	gang: {
		response: `187!!!!!!`
	},
	stats: {
		response: (context, argument) => `${getID(context, argument)}`
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
	},
	start: {
		response: (context, argument) => `${create_livescore(argument)}`
	},
	end: {
		response: (context, argument) => `${reset_livescore(argument)}`
	},
	score: {
		response: (context, argument) => `${calc_livescore(argument)}`
	},
	teams: {
		response: (context, argument) => `${getTeamNames(argument)}`
	},
	currentscore: {
		response: (context, argument) => `${getScore(argument)}`
	}


	
}

"!ls <race_number>,<player_scores>"

""
var team_name = [];
var teams = [];
var team_size;
var amount_of_teams;
var race_counter = 0;
var points = [15,12,10,9,8,7,6,5,4,3,2,1];

function getTeamNames(argument) {
	if (argument == null || argument == "")
	var teamnames_message = ``;
	for (var i = 1; i <= team_name.length; i++) {
		teamnames_message += `Team ${i}: ${team_name[i-1]} `
		if (i != teams.length) teamnames_message += "| "
	}
	return teamnames_message;
}
function getScore(argument) {
	if (argument == null || argument == "")
	var score_message	 = ``;
	for (var i = 1; i <= teams.length; i++) {
		score_message += `Team ${team_name[i-1]}: ${teams[i-1]} `
		if (i != teams.length) score_message += "| "
	}
	return score_message;	
}

function create_livescore(argument) {
	var cls_message;
	if (argument == null || argument == "") cls_message = "Please write all tags after the command."
	else {
		team_name = argument.split(",");
	amount_of_teams = argument.split(",").length;
	team_size = 12/amount_of_teams;
	teams = new Array(amount_of_teams).fill(0);
	race_counter = 1;
	cls_message = `Scoreboard for ${amount_of_teams} teams was created.`
	} 
	return cls_message;
}


function reset_livescore(argument){
	teams = [];
	team_name = [];
	team_size = null;
	race_counter = 0;
	return "Scoreboard successfully resetted.";
}

function calc_livescore(argument) {
	var message;
	var data = argument.split(",");
	var split_counter = argument.split(",").length;
	var sum = eval(data.join('+'))-data[0];
	switch(amount_of_teams) {
		case 2:
			checker = 18;
			break;
		case 3: 
			checker = 24;
			break;
		case 4:
			checker = 30;
			break;
		case 6:
			checker = 42;
			break;
	}

	// Check if every placement is there
	if (sum != checker) message = "U sure u got the right placements?";
	else if (split_counter != 13) message = "U sure u got the right amount of scores?";
	else if (parseInt(data[0]) != race_counter) message = "U sure u got the right race?";
	// calc the table
	else {
		for (var i = 1; i < split_counter; i++ ) {
			console.log(`Team ${data[i]}: ${points[i-1]}`);
			console.log(data[i]);
			teams[parseInt(data[i])-1] += points[i-1]
		}
		message = getScore("");
		if (race_counter < 13) race_counter++;
		if (race_counter == 12) message = "Finished mogi."
	}
	return message;
}


function getRank(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	var playerList = data_list();
	var id = "not";
	for (var i in playerList) {
		if (argument.toLowerCase() == playerList[i][0]) {
			id = playerList[i][1];
			break
		}
	}
	var rank_message = "";
	if (id != "not") {
		var data7 = "";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", mk8_url+id, false);
		xhr.responseType = "document";
		
		xhr.onerror = function() {
			console.error(xhr.status, xhr.statusText);
			rank_message = "Website is currenty down";
		}
		
		// Scrape Rank of the player
		
		xhr.onload = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var data3 = xhr.responseText.substring(xhr.responseText.indexOf("<h1>"), xhr.responseText.indexOf("</h1>"));
				data7 = data3.substring(data3.indexOf("- ")+2);
				rank_message = `Rank of ${argument}: ${data7}`;
			}
		}
		xhr.send();
	} else {
		data7 = "Player not found.";
		rank_message = `Rank of ${argument}: ${data7}`;
	}
	return rank_message;
}

function getMMR(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	var playerList = data_list();
	var id = "not";
	for (var i in playerList) {
		if (argument.toLowerCase() == playerList[i][0]) {
			id = playerList[i][1];
			break
		}
	}
	var mmr_message = "";
	if (id != "not") {
		var data7 = "";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", mk8_url+id, false);
		xhr.responseType = "document";
		
		xhr.onerror = function() {
			console.error(xhr.status, xhr.statusText);
			mmr_message = "Website is currenty down";
		}
		
		// Scrape MMR of the player
		
		xhr.onload = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var data3 = xhr.responseText.substring(xhr.responseText.indexOf("MMR</dt>"), xhr.responseText.indexOf("Peak"));
				var data4 = data3.split("dd");
				data7 = data4[1].substring(data4[1].indexOf(">")+1, data4[1].indexOf("<"));
				mmr_message = `MMR of ${argument}: ${data7}`
			}
	
		}
		xhr.send();
	} else {
		data7 = "Player not found.";
		mmr_message = `MMR of ${argument}: ${data7}`
	}
	
	return mmr_message;
}

function getID(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	var id = "";
	var id_message = "";
	var playerList = data_list();
	for (var i in playerList) {
		if (argument.toLowerCase() == playerList[i][0]) {
			id = playerList[i][1];
			break
		}
	}
	id_message = `Stats of ${argument}: ${mk8_url+id}`
	if (id == "") id_message = "Player was not found in the database.";
	return id_message;
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
		'kjgdhrhrrgg', 'darkgaro', 'crossbell', 'mariyohh', 'foerbs7', 'ciibex'
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
		client.say(channel, response(context, argument));
	}  
});
client.connect();
