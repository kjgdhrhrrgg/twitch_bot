const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(mk8_api_table, numbercheck){
	return function calc(context, argument){
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
			let arg = [];
			let teamsize= [1,2,3,4,6];

			arg = argument.split(",")
			if (arg.length != 14) calc_message = "Please provide the right amount of data. (!lm <teamsize>,<teamplacement>, 12 player names split with by an comma)"
			if (numbercheck(arg[0]) && numbercheck(arg[1])) {
				arg[0] = parseInt(arg[0]);
				arg[1] = parseInt(arg[1]);
				if (teamsize.includes(arg[0]) && arg[1]<=12/arg[0] && arg[1>0]) {
					//code to calculate starts here
					
				}
				else console.log("pass unsuccessful");//
			}
			// argument = <teamsize>, <teamplacement>, player1, ..., player12
			// teamplacement can be calulated by dividing 12/<teamsize>,
			calc_message="Worked so far"
		}
		return calc_message;
	}
	
};