function help(argument) {
	let help_msg = "";
	if (typeof argument === 'string') {
		argument = argument.toLowerCase();
	  } else {
		// If argument is not provided or not a string, set it to an empty string
		argument = "";
	  }	
	  console.log(argument);
	  switch(argument) {
		case "mmr": 
			help_msg = "The mmr command will show the MMR of a certain player for 150 cc Lounge. Use !mmr to show your own MMR, !mmr <twitch_name/lounge_name> for that users MMR";
			break;
		case "rank": 
			help_msg = "The rank command will show the rank of a certain player for 150 cc Lounge. Use !rank to show your own Rank, !rank <twitch_name/lounge_name> for that users rank";
			break;		
		case "lm": 
			help_msg = "The lm command will show the last match of a certain player for 150 cc Lounge. Use !lm to show your own last match, !lm <twitch_name/lounge_name> for that users last match";
			break;	
		case "stats": 
			help_msg = "The stats command will show some stats of a certain player for 150 cc Lounge. Use !stats to show your own stats, !stats <twitch_name/lounge_name> for that users stats";
			break;	
		case "db":
			help_msg = "The db command will show you if you are in the current database. Use !db to look up if you are in there yet, !db <twitch_name> to check if this user is in database";
			break;
		case "peak":
			help_msg = "The peak command will show the max mmr reached of a certain player.";
			break;
		case "nh":
			help_msg = "The nh command will show all the usernames, which the player used on this account?";
			break;
		default:
			help_msg = "Available commands to look up: !mmr !rank !stats !lm !db !peak";
	}
	return help_msg;
}

module.exports = help;