const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(mk8_api_table, numbercheck){
	return function calc(context, argument){
		let calc_message;
		let id;
		if (argument == null || argument == "") calc_message = "Not enough data was given";
		// if argument is talbeiD
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
							const mmr = json_data.teams[i].scores[j].delta;
							const playerName = json_data.teams[i].scores[j].playerName;
							const formattedMMR = mmr > 0 ? `+${mmr}` : mmr;

							if (j == json_data.teams[i].scores.length - 1 && i == json_data.teams.length - 1) {
								calc_message += `${playerName} (${formattedMMR} MMR)`;
							} else if (j == json_data.teams[i].scores.length - 1) {
								calc_message += `${playerName} (${formattedMMR} MMR) | `;
							} else {
								calc_message += `${playerName}, `;
							}
						}
					}
				}
			}
			xhr.send();
	
		}
		// if argument contains data to calculate
		else if (argument.includes(",")) {
			let arg = [];
			let teamsize= [1,2,3,4,6];

			//constants for calculation
			let caps = {1: 60, 2: 120, 3: 180, 4: 240, 6: 300};
			let offsets = {1: 9500, 2: 5500, 3: 5100, 4: 4800, 6: 4650};
			let scalingFactors = {1: 2746.116, 2: 1589.856, 3: 1474.230, 4: 1387.511, 6: 1344.151};

			arg = argument.split(",")
			if (arg.length != 14) calc_message = "Please provide the right amount of data. (!lm <teamsize>,<your_teamplacement>, 12 player_names split by a comma)"
			if (numbercheck(arg[0]) && numbercheck(arg[1])) {
				let current_teamsize = parseInt(arg[0]);
				let your_teamplacement = parseInt(arg[1]);
				if (teamsize.includes(arg[0]) && arg[1]<=12/arg[0] && arg[1]>0) {
					let mmr_list = []
					let teammate_counter = 0
					//grab current mmr for each player and push to names, might calculate the avg team mmr + room mmr
					for (let i = 2; i <= 14; i++) {
						
						let xhr = new XMLHttpRequest();
						id = mk8_api_table+arg[i];
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
								mmr_list.push(json_data.mmr)
							}
						}
						xhr.send();
					}
					// calculate room mmr + team_mmr
					let room_mmr = 0;
					let team_mmr = [];
					let current_team_mmr = 0;
					for (i in mmr_list) {
						room_mmr += mmr_list[i];
						current_team += mmr_list[i];
						teammate_counter++;
						if (teammate_counter == current_teamsize) {
							team_mmr.push(current_team_mmr/current_teamsize);
							current_team_mmr = 0;
							teammate_counter = 0;
						}
						if (i == 11) room_mmr = room_mmr/(12/current_teamsize);
					}
					let your_teamm_mmr = team_mmr[your_teamplacement-1];
					console.log(your_teamm_mmr, team_mmr, room_mmr);
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