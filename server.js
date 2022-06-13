const tmi = require('tmi.js');
require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const mk8_url = 'https://www.mk8dx-lounge.com/PlayerDetails/';
const mk8_id_url = 'https://www.mk8dx-lounge.com/api/player?mkcId=';
const mk8_name_url = 'https://www.mk8dx-lounge.com/api/player?name=';
const mk8_stats_url = 'https://www.mk8dx-lounge.com/api/player/details?name=';
const mk8_table = 'https://www.mk8dx-lounge.com/TableDetails/'
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const commands = {
	
	// Commands for publicity

	mmr: {
		response: (context, argument) => `${getMMR(context, argument)}`
	},
	rank: {
		response: (context, argument) => `${getRank(context, argument)}`
	},
	stats: {
		response: (context, argument) => `${getID(context, argument)}`
	},
	help:{
		response: (context, argument) => `${help(argument)}`
	},
	db: {
		response: (context, argument) => `${database(context, argument)}`
	},
	lm: {
		response: (context, argument) => `${lm(context, argument)}`
	},
	/*
	nh: {
		response: (context, argument) => `${nh(context, argument)}`
	},
	*/
	
	// Scoreboard commands (currently in beta)
	
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
	}}


/*
	Functions and co to calculate a table via the chat. Currently only for kjgdhrhrrgg, unless you deploy your own bot with this code.
*/


var team_name = [];
var teams = [];
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
			teams[parseInt(data[i])-1] += points[i-1]
		}
		message = getScore("");
		if (race_counter == 12) message += " | Finished mogi."
		if (race_counter < 13) race_counter++;
	}
	return message;
}



/*
	Public commands which everyone can use.
*/

var playerList = data_list();

// Can look up by lounge username for rank, if search for someone via the twitch username -> convert the lounge id to lounge username first
function getRank(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	var id=mk8_stats_url+argument;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) id = convert_from_db(argument, mk8_stats_url);
	
	var rank_message = "";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		rank_message = "Website is currently down";
	}
		
		
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var json_data = JSON.parse(this.responseText);
			var data= [];
			for (var i in json_data) {
				data.push([i,json_data[i]]);
			} 
			if (data.length == 4) {
				rank_message = `Rank of ${argument}: Not found.`;
			} else {
				rank_message = `Rank of ${argument}: ${data[data.length-2][1]}`;
			}

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
	var id=mk8_name_url+argument;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) id = convert_from_db(argument, mk8_name_url);
	
	var mmr_message = "";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		mmr_message = "Website is currently down";
	}		
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var json_data = JSON.parse(this.responseText);
			var data= [];
			for (var i in json_data) {
				data.push([i,json_data[i]]);
			} 
			mmr_message = `MMR of ${argument}: Player not found`;
			if(data.some(row => row.includes("mmr"))) {
				for(var i in data) {
					if (data[i][0] == 'mmr') {
						mmr_message = `MMR of ${argument}: ${data[i][1]}`;
						break;
					}	
				}	
			}
		}
	}
	xhr.send();
	return mmr_message;
	}

// Sends the stats page of a certain user.
// Use the api to get the lounge id of the user

function getID(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	var id=mk8_name_url+argument;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) id = convert_from_db(argument, mk8_name_url);

	var id_message = "";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		id_message = "Website is currently down";
	}		
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var json_data = JSON.parse(this.responseText);
			var data= [];
			for (var i in json_data) {
				data.push([i,json_data[i]]);
			} 
			id_message = `Stats page of ${argument}: Player not found`;
			if(data.some(row => row.includes("id"))) {
				for(var i in data) {
					if (data[i][0] == 'id') {
						id_message = `Stats page of ${argument}: ${mk8_url+data[i][1]}`;
						break;
					}	
				}	
			}
		}
	}
	xhr.send();
	return id_message;
}

// Function to load the database and converts to javascript array 
// don't know if this part is skipable (maybe through jQuery but idk) once it got updated. (It should, but I'm not sure)

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



function convert_from_db(argument, link) {
	var id = "";
	playerList = data_list();
	for (var i in playerList) {
		if (argument.toLowerCase() == playerList[i][0]) {
			id = mk8_id_url+playerList[i][1];
			break
		}
	}
	var id_message = "";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		id_message = "Website is currenty down";
	}		
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var json_data = JSON.parse(this.responseText);
			var data= [];
			for (var i in json_data) {
				data.push([i,json_data[i]]);
			} 
			if(data.some(row => row.includes("id"))) {
				for(var i in data) {
					if (data[i][0] == 'name') {
						id_message = link+data[i][1];
						break;
					}	
				}	
			}
		}
	}
	xhr.send();
	return id_message;
}

// Check if certain user is in database already

function database(context, argument) {
	
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	var db_msg = `${argument} is not in the database. Message @kjg_mk8dx on twitter, so he can add you to the database`;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) db_msg = `${argument} is in the database.`
	return db_msg;

}

// Get data from latest mogi 


function lm(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	var id = mk8_stats_url+argument;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) id = convert_from_db(argument, mk8_stats_url);

	var xhr = new XMLHttpRequest();
	var lm_message = "";
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
			var json_data = JSON.parse(this.responseText);
			var data = [];
			var lm_data = [];
			for (var i in json_data) {
				data.push([i,json_data[i]]);
			} 
			for (var j in data) {
				if (data[j][0] == "mmrChanges")
					for (var k in data[j][1][0])
						lm_data.push([k,data[j][1][0][k]])
			} 
			
			if (lm_data.length == 11) {
				var win = "Lose";
				var format = `${lm_data[6][1].length + 1}v${lm_data[6][1].length + 1}`;
				if (lm_data[10][1] == 12) format = "FFA";
				if (lm_data[2][1]>=0) win = "Win"
				// Last Match of kjg: Win | Format:  EF 3v3 | Score: 105 | Team Placement: 1
				lm_message = `Last Match of ${argument}: ${win} (${lm_data[2][1]} MMR) | 
				Format: Tier ${lm_data[9][1]} ${format} | 
				own Score: ${lm_data[5][1]} | 
				Team Placement: ${lm_data[8][1]} of ${lm_data[10][1]} | 
				TableID: ${mk8_table+lm_data[0][1]}`;
			}
			else {
				lm_message = `Last Match of ${argument}: Match cannot be found`
			}
		}
	}
	xhr.send();
	return lm_message;


}

// Name history doesn't work as intented, have to look after my exams


/*
function nh(context, argument) {
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	var id=mk8_stats_url+argument;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) id = convert_from_db(argument, mk8_stats_url);
	
	var nh_message = "";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", id, false);
	xhr.responseType = "document";
	xhr.onerror = function() {
		console.error(xhr.status, xhr.statusText);
		rank_message = "Website is currently down";
	}
		
		
	xhr.onload = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var json_data = JSON.parse(this.responseText);
			var data = [];
			var names = [];
			var test = [];
			
			for (var i in json_data) {
				data.push([i,json_data[i]]);
			}
			for (var i in data[data.length-3][1]) {
				names.push(data[data.length-3][1][i])
			}
			for (var i in names) {
				test.push(names[i]);
			}
			console.log(names[0].substring(6));
			//names = data[data.length-3][1][];
			//console.log(data[data.length-3][1][0]);
			//console.log(names);
			//console.log(test);
			




			if (data.length == 4) {
				nh_message = `Name history of ${argument}: Not found.`;
			} else {
				nh_message = `Name history of ${argument}: ${data[data.length-3][1]}`;
			}

		}
	}
	xhr.send();
	return nh_message;
}

*/
// Show all help messages

function help(argument) {
	var help_msg = "";
	if (argument == null || argument == "") argument = "something else"
	switch(argument.toLowerCase()) {
		case "mmr": 
			help_msg = "The mmr command will show the MMR of a certain player for 150 cc Lounge. Use !mmr to show your own MMR, !mmr <twitch_name/lounge_name> for that users MMR";
			break;
		case "rank": 
			help_msg = "The rank command will show the MMR of a certain player for 150 cc Lounge. Use !rank to show your own Rank, !rank <twitch_name/lounge_name> for that users rank";
			break;		
		case "lm": 
			help_msg = "The lm command will show the last match of a certain player for 150 cc Lounge. Use !lm to show your own last match, !lm <twitch_name/lounge_name> for that users last match";
			break;	
		case "stats": 
			help_msg = "The mmr command will show the MMR of a certain player for 150 cc Lounge. Use !mmr to show your own MMR, !mmr <twitch_name/lounge_name> for that users MMR";
			break;	
		case "db":
			help_msg = "The db command will show you if you are in the current database. Use !db to look up if you are in there yet, !db <twitch_name> to check if this user is in database";
			break;
		case "outfit":
			help_msg = "Will send a random compliment to @Mariyohh about her outfit. Currently 4 compliments included"
			break;
		default:
			help_msg = "Available commands to look up: !mmr !rank !stats !lm !db";
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
