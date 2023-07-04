require('dotenv').config();
const { json } = require('express');
const tmi = require('tmi.js');

const functions = require('./functions/index');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const commands = {
	
	// Commands for publicity

	mmr: {
		response: (context, argument) => `${functions.getMMR(context, argument)}`
	},
	peak: {
		response: (context, argument) => `${functions.getPeak(context,argument)}`
	},
	rank: {
		response: (context, argument) => `${functions.getRank(context, argument)}`
	},
	stats: {
		response: (context, argument) => `${functions.getStats(context, argument)}`
	},
	help:{
		response: (context, argument) => `${functions.getHelp(context, argument)}`
	},
	db: {
		response: (context, argument) => `${functions.checkDB(context, argument)}`
	},
	lm: {
		response: (context, argument) => `${functions.getLM(context, argument)}`
	},
	fclounge: {
		response: (context, argument) => `${functions.getFC(context, argument)}`
	},
	nh: {
		response: (context, argument) => `${functions.getNH(context, argument)}`
	},
	last: {
		response: (context, argument) => `${functions.getLast(context, argument)}`
	},
	calc: {
		response: (context, argument) => `${functions.getCalc(context, argument)}`
	}
}

const client = new tmi.Client({
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	connection: {
		reconnect: true
	},
	channels: process.env.TWITCH_SUPPORTED_CHANNELS.split(", ")
});

client.on('message', async (channel, context, message) => {
	
	
	const isNotBot = context.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME.toLowerCase();
	
	if (!isNotBot) return;
	if (message.charAt(0) != "!") return;
	
	const [raw, command, argument] = message.match(regexpCommand);
	const { response } = commands[command] || {};

	if (typeof response === 'string'){
		client.say(channel, response)
	} else if (typeof response === 'function') {
		client.say(channel, response(context, argument));
	}  
});
client.connect();