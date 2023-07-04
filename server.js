const { json } = require('express');
const tmi = require('tmi.js');
require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const mk8_id_url = 'https://www.mk8dx-lounge.com/api/player?mkcId=';
const mk8_stats_url = 'https://www.mk8dx-lounge.com/api/player/details?name=';
const mk8_table = 'https://www.mk8dx-lounge.com/TableDetails/';
const mk8_api_table = 'https://www.mk8dx-lounge.com/api/table?tableId=';
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const commands = {
	
	// Commands for publicity

	mmr: {
		response: (context, argument) => `${getMMR(context, argument)}`
	},
	peak: {
		response: (context, argument) => `${getPeak(context,argument)}`
	},
	rank: {
		response: (context, argument) => `${getRank(context, argument)}`
	},
	stats: {
		response: (context, argument) => `${getID(context, argument)}`
	},
	help:{
		response: (context, argument) => `${help(context, argument)}`
	},
	db: {
		response: (context, argument) => `${database(context, argument)}`
	},
	lm: {
		response: (context, argument) => `${lm(context, argument)}`
	},
	fclounge: {
		response: (context, argument) => `${getFC(context, argument)}`
	},
	
	nh: {
		response: (context, argument) => `${nh(context, argument)}`
	},
	last: {
		response: (context, argument) => `${last(context, argument)}`
	},
	calc: {
		response: (context, argument) => `${calc(context, argument)}`
	}
}

/*
	Public commands which everyone can use.
*/

var playerList = data_list();

// Check if something contains numbers only (for lm, last, etc)
function numbercheck(input) {
	let regex = /^[0-9]+$/;
	return regex.test(input);
}
// Can look up by lounge username for rank, if search for someone via the twitch username -> convert the lounge id to lounge username first
function getRank(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	let id=mk8_stats_url+argument;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) id = convert_from_db(argument, mk8_stats_url);
	
	let rank_message = "";
	let xhr = new XMLHttpRequest();
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		rank_message = "Website is currently down";
	}
		
		
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let json_data = JSON.parse(this.responseText);
			rank_message = `Rank of ${argument}:  ${json_data.overallRank} (${json_data.rank})`;
		}
	}
	xhr.send();
	return rank_message;
}

// Usage of the api to get the mmr of a player.
// Check the database if username is a twitch user

function getMMR(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	let id=mk8_stats_url+argument;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) id = convert_from_db(argument, mk8_stats_url);
	
	let mmr_message = "";
	let xhr = new XMLHttpRequest();
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		mmr_message = "Website is currently down";
	}		
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let json_data = JSON.parse(this.responseText);
			mmr_message = `MMR of ${argument}: ${json_data.mmr}`;
		}
	}
	xhr.send();
	return mmr_message;
	}
// Usage of the api to get the peak mmr of a player,
// Check the database if username is a twitch user
function getPeak(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	let id=mk8_stats_url+argument;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) id = convert_from_db(argument, mk8_stats_url);
	
	let peak_message = "";
	let xhr = new XMLHttpRequest();
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		peak_message = "Website is currently down";
	}		
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let json_data = JSON.parse(this.responseText);
			peak_message = `Peak MMR of ${argument}: ${json_data.maxMmr}`;		
		}
	}
	xhr.send();
	return peak_message;
	}
// Sends the stats page of a certain user.
// Use the api to get the lounge id of the user

function getID(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	let id=mk8_stats_url+argument;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) id = convert_from_db(argument, mk8_stats_url);

	let id_message = "";
	let xhr = new XMLHttpRequest();
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		id_message = "Website is currently down";
	}

	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let json_data = JSON.parse(this.responseText);
			id_message = `Stats of ${argument}: 
				Rank: ${json_data.overallRank} | 
				Winrate: ${parseFloat(json_data.winRate*100).toFixed(2)}% | 
				W-L: ${json_data.winLossLastTen} | 
				PlayerAverage: - | 
				PartnerAverage: -`;
			if (json_data.hasOwnProperty("averageScore")) {
				id_message = `Stats of ${argument}: 
					Rank: ${json_data.overallRank} | 
					Winrate: ${parseFloat(json_data.winRate*100).toFixed(2)}% | 
					W-L: ${json_data.winLossLastTen} | 
					PlayerAverage: ${json_data.averageScore.toFixed(1)} | 
					PartnerAverage: ${json_data.partnerAverage.toFixed(1)}`;
			}
		}
	}
	xhr.send();
	return id_message;
}

// Grab friendcode, dunno why Im buildiung this feature
function getFC(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	let id=mk8_stats_url+argument;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) id = convert_from_db(argument, mk8_stats_url);
	
	let fc_message = "";
	let xhr = new XMLHttpRequest();
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		fc_message = "Website is currently down";
	}	
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let json_data = JSON.parse(this.responseText);
			fc_message = `Friendcode of ${argument}: ${json_data.switchFc}`;
		}
	}
	xhr.send();
	return fc_message;
}


// Function to load the database and converts to javascript array 
// don't know if this part is skipable (maybe through jQuery but idk) once it got updated. (It should, but I'm not sure)

function data_list(){
	let db = [];
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "https://raw.githubusercontent.com/kjgdhrhrrgg/twitch_bot_db/master/data-list.json", false);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let test = JSON.parse(this.responseText);
			for (let i in test) {
				db.push([i,test[i]]);
			}
		}
	}
	xhr.send();
	return db;
}


function convert_from_db(argument, link) {
	let id = "";
	playerList = data_list();
	for (let i in playerList) {
		if (argument.toLowerCase() == playerList[i][0]) {
			id = mk8_id_url+playerList[i][1];
			break
		}
	}
	let id_message = "";
	let xhr = new XMLHttpRequest();
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		id_message = "Website is currenty down";
	}		
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let json_data = JSON.parse(this.responseText);
			id_message=link+json_data.name
		}
	}
	xhr.send();
	console.log(id_message);
	return id_message;
}

// Check if certain user is in database already

function database(context, argument) {
	
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	let db_msg = `${argument} is not in the database. Message @kj_mk8dx on twitter, so he can add you to the database`;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) db_msg = `${argument} is in the database.`
	return db_msg;

}

// Get data from any mogi 
// Format: !lm <name>,<number> / 


function lm(context, argument) {
	// arg["name","number"]
	let arg = [];
	// no input
	if (argument == null || argument == "") {
		argument = context.username.toLowerCase();
		arg[0]=argument;
		arg[1]=0;
	}
	// 
	if (numbercheck(argument)) {
		arg[1] = parseInt(argument)-1;
		argument = context.username.toLowerCase();
		arg[0] = argument;
	} else {
		arg[1] = 0;
		if (argument.charAt(0)== '@') argument = argument.substring(1);
		arg[0] = argument;
	}
	if (argument.includes(",")) {
		arg = argument.split(',');
		if (arg[0].charAt(0)== '@') arg[0] = arg[0].substring(1);
		console.log(arg[1]);
		arg[1] = parseInt(arg[1])-1
	}
	
	let id = mk8_stats_url+arg[0];
	if (playerList.some(row => row.includes(arg[0].toLowerCase()))) id = convert_from_db(arg[0], mk8_stats_url);

	let xhr = new XMLHttpRequest();
	let lm_message = "";
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		lm_message = "Website is currenty down";
	}		
	
	// Quick reminder how mmrChanges works
	// shows tables, placements and strikes etc
	// table.length = 11 always!!
	// last match shows if win or loss, and (team) placement
	
	
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let json_data = JSON.parse(this.responseText);
			let testIndex = arg[1];
			if (json_data.mmrChanges && json_data.mmrChanges[testIndex] && testIndex >= 0 && json_data.mmrChanges[testIndex].reason == "Table") {
  				let item = json_data.mmrChanges[testIndex];
				let win = 'Lose';
				let format = 'FFA';
				if (item.mmrDelta >= 0) win = 'Win';
				if (item.partnerIds.length > 0 ) format = `${item.partnerIds.length + 1}v${item.partnerIds.length + 1}`
				lm_message = `Last Match of ${arg[0]}: ${win} (${item.mmrDelta} MMR) |
					Format: Tier ${item.tier} ${format} |
					own Score: ${item.score} |
					Team Placement: ${item.rank} of ${item.numTeams} |
					TableID: ${mk8_table+item.changeId} `
			} else {
				lm_message = "Last Match is either a strike, placement or not found."
			}
		}
		if (xhr.status == 404) lm_message = `${arg[0]} not found. Have you typed the wrong command format?`
	}
	xhr.send();
	return lm_message;
}

function last(context, argument) {
	// arg["name","number"]
	let arg = [];
	// no input
	if (argument == null || argument == "") {
		argument = context.username.toLowerCase();
		arg[0]=argument;
		arg[1]=1;
	}
	// 
	if (numbercheck(argument)) {
		arg[1] = parseInt(argument);
		argument = context.username.toLowerCase();
		arg[0] = argument;
	} else {
		arg[1] = 1;
		if (argument.charAt(0)== '@') argument = argument.substring(1);
		arg[0] = argument;
	}
	if (argument.includes(",")) {
		arg = argument.split(',');
		if (arg[0].charAt(0)== '@') arg[0] = arg[0].substring(1);
		arg[1] = parseInt(arg[1]);
	}
	
	let id = mk8_stats_url+arg[0];
	if (playerList.some(row => row.includes(arg[0].toLowerCase()))) id = convert_from_db(arg[0], mk8_stats_url);

	let xhr = new XMLHttpRequest();
	let last_message = "";
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		last_message = "Website is currenty down";
	}		
	
	// Quick reminder how mmrChanges works
	// shows tables, placements and strikes etc
	// table.length = 11 always!!
	// last match shows if win or loss, and (team) placement
	
	
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let json_data = JSON.parse(this.responseText);
			let win = 0;
			let loss = 0;
			let avgsc = 0;
			let pavgsc = 0;
			let icounter = arg[1];
			let mmrdiff = 0;
			let ffacounter = 0;
			for (let i = 0; i < icounter; i++) {
				if (json_data.mmrChanges[i].reason != "Table" ) {
					icounter++;
					continue ;
				}
				avgsc += json_data.mmrChanges[i].score;
				mmrdiff += json_data.mmrChanges[i].mmrDelta;
				
				if (json_data.mmrChanges[i].mmrDelta > 0) {
					win++;
				} else {
					loss++;
				}
				
				if (json_data.mmrChanges[i].partnerScores.length>1) {
					let pScores = 0;
					for (let j in json_data.mmrChanges[i].partnerScores){
						pScores += json_data.mmrChanges[i].partnerScores[j];
					}
					pavgsc += pScores/json_data.mmrChanges[i].partnerScores.length;
				} 
				if (json_data.mmrChanges[i].numTeams == "12") {
					pavgsc += 0;
					ffacounter++;
				} 
				else {
					pavgsc += json_data.mmrChanges[i].partnerScores[0];
				}
			}			
			
			avgsc = avgsc/icounter;
			pavgsc = pavgsc/(icounter-ffacounter);
			last_message = `Last ${icounter} matches of ${arg[0]}: Win Rate: ${(win/(win+loss)*100).toFixed(1)}% | 
			W-L: ${win} - ${loss} |  
			+/-: ${mmrdiff} | 
			Avg. Score: ${avgsc} | 
			Partner Avg.: ${pavgsc}`;

		}
		if (xhr.status == 404) last_message = `${arg[0]} not found. Have you typed the wrong command format?`
	}
	xhr.send();
	return last_message;
}

function calc(context, argument){
	let calc_message;
	let id;
	if (argument == null || argument == "") calc_message = "Not enough data was given";
	else if (numbercheck(argument)) {
		id = mk8_api_table+argument;
		let xhr = new XMLHttpRequest();
		xhr.open("GET", id, false);
		xhr.responseType = "document";
		xhr.onerror = function() {
			console.error(xhr.status, xhr.statusText);
			calc_message = "Website is currently down";
		}	
		xhr.onload = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				let json_data = JSON.parse(this.responseText);
				calc_message = `Expected MMR Changes for TableID ${argument}: `		
				for (i in json_data.teams) {
					for (j in json_data.teams[i].scores) {
						if (j == json_data.teams[i].scores.length-1 && i == json_data.teams.length-1) {
							calc_message += `${json_data.teams[i].scores[j].playerName} (${json_data.teams[i].scores[j].delta})`;
						}
						else if (j == json_data.teams[i].scores.length-1) {
							calc_message += `${json_data.teams[i].scores[j].playerName} (${json_data.teams[i].scores[j].delta}) | `;
						} else {
							calc_message += `${json_data.teams[i].scores[j].playerName}, `;
						}		
					}
				}
			}
		}
		xhr.send();

	}
	else if (argument.includes(",")) {
		id = argument
	}
	return calc_message;
}


// Name history doesn't work as intented, have to look after my exams
// Kinda works now, thanks to @Chaos375 


function nh(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	let id=mk8_stats_url+argument;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) id = convert_from_db(argument, mk8_stats_url);
	
	let nh_message = "";
	let xhr = new XMLHttpRequest();
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		rank_message = "Website is currently down";
	}
		
		
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let json_data = JSON.parse(this.responseText);
			let names = [];
			for (let i in json_data.nameHistory) {
				names.push(json_data.nameHistory[i].name)
			}
			nh_message = `Name history of ${argument}: ${names}`;
		}
	}
	xhr.send();
	return nh_message;
}


// Show all help messages

function help(argument) {
	let help_msg = "";
	if (argument == null || argument == "") argument = "something else"
	switch(argument.toLowerCase()) {
		case "mmr": 
			help_msg = "The mmr command will show the MMR of a certain player for 150 cc Lounge. Use !mmr to show your own MMR, !mmr <twitch_name/lounge_name> for that users MMR";
			break;
		case "rank": 
			help_msg = "The rank command will show the rank of a certain player for 150 cc Lounge. Use !rank to show your own Rank, !rank <twitch_name/lounge_name> for that users rank";
			break;		
		case "lm": 
			help_msg = "The lm command will show the last match of a certain player for 150 cc Lounge. Use !lm to show your own last match, !lm <twitch_name/lounge_name> for that users last match";
			break;	
		case "stats": 
			help_msg = "The stats command will show some stats of a certain player for 150 cc Lounge. Use !stats to show your own stats, !stats <twitch_name/lounge_name> for that users stats";
			break;	
		case "db":
			help_msg = "The db command will show you if you are in the current database. Use !db to look up if you are in there yet, !db <twitch_name> to check if this user is in database";
			break;
		case "peak":
			help_msg = "The peak command will show the max mmr reached of a certain player.";
			break;
		case "nh":
			help_msg = "The nh command will show all the usernames, which the player used on this account?";
			break;
		default:
			help_msg = "Available commands to look up: !mmr !rank !stats !lm !db !peak";
	}
	return help_msg;
}

const client = new tmi.Client({
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	connection: {
		reconnect: true
	},
	channels: process.env.TWITCH_SUPPORTED_CHANNELS.split(", ")
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