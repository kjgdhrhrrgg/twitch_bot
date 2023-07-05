const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(playerList, mk8_stats_url, convert_from_db){
	return function getStats(context, argument) {
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
};