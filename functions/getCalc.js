const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const mk8_api_table = require('./index.js').mk8_api_table;
const numbercheck = require('./index.js').numbercheck;


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

module.exports = calc;