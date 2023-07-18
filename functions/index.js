const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const mk8_id_url = 'https://www.mk8dx-lounge.com/api/player?mkcId=';
const mk8_stats_url = 'https://www.mk8dx-lounge.com/api/player/details?name=';
const mk8_table = 'https://www.mk8dx-lounge.com/TableDetails/';
const mk8_api_table = 'https://www.mk8dx-lounge.com/api/table?tableId=';

// Check if something contains numbers only (for lm, last, etc)
function numbercheck(input) {
	let regex = /^[0-9]+$/;
	return regex.test(input);
}

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

var playerList = data_list();

module.exports = {
	getMMR: require('./getMMR')(playerList,mk8_stats_url, convert_from_db),
	getRank: require('./getRank')(playerList, mk8_stats_url, convert_from_db),
	getPeak: require('./getPeak')(playerList, mk8_stats_url, convert_from_db),
	getStats: require('./getStats')(playerList, mk8_stats_url, convert_from_db),
	getNH: require('./getNH')(playerList, mk8_stats_url, convert_from_db),
	getFC: require('./getFC')(playerList, mk8_stats_url, convert_from_db),
	getHelp: require('./getHelp'),
	getCalc: require('./getCalc')(mk8_stats_url, mk8_api_table, numbercheck),
	getLast: require('./getLast')(playerList, mk8_stats_url, convert_from_db, numbercheck),
	getLM: require('./getLM')(playerList, mk8_stats_url, mk8_table,convert_from_db, numbercheck),
	checkDB: require('./checkDB')(playerList)
}