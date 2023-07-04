const playerList = require('./index.js').data_list;

function database(context, argument) {
	
	if (argument == null || argument == "") argument = context.username.toLowerCase();
	if (argument.charAt(0)== '@') argument = argument.substring(1);
	let db_msg = `${argument} is not in the database. Message @kj_mk8dx on twitter, so he can add you to the database`;
	if (playerList.some(row => row.includes(argument.toLowerCase()))) db_msg = `${argument} is in the database.`
	return db_msg;

}

module.exports = database;