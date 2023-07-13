const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(playerList,mk8_stats_url,convert_from_db,numbercheck){
	return function last(context, argument) {
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
				pavgsc = (pavgsc/(icounter-ffacounter)).toFixed(1);
				last_message = `Last ${icounter} matches of ${arg[0]}: Win Rate: ${(win/(win+loss)*100).toFixed(1)}% | 
				W-L: ${win} - ${loss} |  
				+/- MMR: ${mmrdiff > 0 ? `+${mmrdiff}` : mmrdiff} | 
				Avg. Score: ${avgsc} | 
				Partner Avg.: ${pavgsc}`;
	
			}
			if (xhr.status == 404) last_message = `${arg[0]} not found. Have you typed the wrong command format?`
		}
		xhr.send();
		return last_message;
	}
};