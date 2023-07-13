const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(playerList,mk8_stats_url, mk8_table, convert_from_db,numbercheck){
	return function lm(context, argument) {
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
					lm_message = `Last Match of ${arg[0]}: ${win} (${item.mmrDelta >= 0 ? `+${item.mmrDelta}` : item.mmrDelta} MMR) |
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
};