const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const mk8_stats_url = require('./index.js').mk8_stats_url;
const playerList = require('./index.js').data_list;
const convert_from_db = require('./index.js').convert_from_db;

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

module.exports = getMMR;