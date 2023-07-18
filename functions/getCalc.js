const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(mk8_stats_url, mk8_api_table, numbercheck){
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
			let scalingFactors = {1: 9500, 2: 5500, 3: 5100, 4: 4800, 6: 4650};
			let offsets = {1: 2746.116, 2: 1589.856, 3: 1474.230, 4: 1387.511, 6: 1344.151};

			arg = argument.split(",")
			if (arg.length != 14) calc_message = "Please provide the right amount of data. (!lm <teamsize>,<your_teamplacement>, 12 player_names split by a comma)"
			if (numbercheck(arg[0]) && numbercheck(arg[1])) {
				let current_teamsize = parseInt(arg[0]);
				let your_teamplacement = parseInt(arg[1]);
				if (teamsize.includes(current_teamsize) && your_teamplacement<=12/current_teamsize && your_teamplacement>0) {
					let mmr_list = []
					//grab current mmr for each player and push to names, might calculate the avg team mmr + room mmr
					for (let i = 2; i <= 14; i++) {					
						let xhr = new XMLHttpRequest();
						id = mk8_stats_url+arg[i];
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
					let team_mmr = [];
					let teammate_counter = 0;
					let current_team_mmr = 0;
					for (i in mmr_list) {
						current_team_mmr += mmr_list[i];
						teammate_counter++;
						if (teammate_counter==current_teamsize) {
							team_mmr.push(current_team_mmr/current_teamsize);
							current_team_mmr = 0;
							teammate_counter = 0;
						}
					}
					let your_teamm_mmr = team_mmr[your_teamplacement-1];
					
					// generate mmr list and sort it for min and max mmr gain/loss per placement
					
					let sort_team_mmr = [];
					let remaining = team_mmr.filter((element) => element !== your_teamm_mmr)
					for (let i = 0; i < remaining.length; i++) {
						let tempList = remaining.slice();
						tempList.splice(i, 0, your_teamm_mmr);
						sort_team_mmr.push(tempList);
						let reversedTempList = tempList.slice().reverse();
						sort_team_mmr.push(reversedTempList)
					}
					sort_team_mmr.sort((arr1, arr2) => {
						let index1 = arr1.indexOf(your_teamm_mmr);
						let index2 = arr2.indexOf(your_teamm_mmr);

						if (index1 !== index2) {
							return index1 - index2;
						}
						for (let i = 0; i < index1.length; i++) {
							if (arr1[i] !== arr2[i]) {
								return arr1[i]-arr2[i];
							}
						}
						return 0;
					});
					// calculate mmr delta
					let mmrDelta = [];
					for (i in sort_team_mmr) {
						let delta = 0;
						for (j in sort_team_mmr[i]) {
							if (sort_team_mmr[i][j] == your_teamm_mmr) continue;
						
							if (j < sort_team_mmr[i].indexOf(your_teamm_mmr)) {
								delta -= caps[current_teamsize] / (1 + Math.pow(11, -(your_teamm_mmr - sort_team_mmr[i][j] - offsets[current_teamsize]) / scalingFactors[current_teamsize]));
							}
							else if (j > sort_team_mmr[i].indexOf(your_teamm_mmr)) {
								delta += caps[current_teamsize] / (1 + Math.pow(11, -(sort_team_mmr[i][j] - your_teamm_mmr - offsets[current_teamsize]) / scalingFactors[current_teamsize]));
							}
						}
						mmrDelta.push(delta.toFixed(0))
					}
					calc_message = `Expected MMR Changes for Team ${your_teamplacement}: `;
					for (let i = 0; i<mmrDelta.length; i++) {
						if (i == 0) {
							calc_message += `1st: ${mmrDelta[0]} | `
						} 
						
						else if (i%2 == 0 && mmrDelta.length != 2) continue;
						
						// 6v6 case
						else if(i==1){
							if (i == mmrDelta.length - 1 && mmrDelta.length == 2) {
								calc_message += `2nd: ${mmrDelta[i]} `
								break;
							}
							// other cases for 2nd
							else {
								calc_message += `2nd: ${mmrDelta[i+1]} - ${mmrDelta[i]} | `
							}
						}
						else if(i==3){
							// case for 4v4
							if (i == mmrDelta.length - 1 && mmrDelta.length == 4) {
								calc_message += `3rd: ${mmrDelta[i]} `
								break;
							}
							else { 
								calc_message += `3rd: ${mmrDelta[i+1]} - ${mmrDelta[i]} | `
							}
						}
						else {
							if (i == mmrDelta.length - 1 && mmrDelta.length > 4) {
								calc_message += `${((i+2)/2).toFixed(0)}th: ${mmrDelta[i]}`
								break;
							} else {
								calc_message += `${((i+2)/2).toFixed(0)}th: ${mmrDelta[i+1]} - ${mmrDelta[i]} | `
							}
						}
					} 
				}
				else {
					calc_message = "The format or your team placement is wrong. Please correct it"
				};
			}
			// argument = <teamsize>, <teamplacement>, player1, ..., player12
			//calc_message="Worked so far"
		}
		return calc_message;
	}
};