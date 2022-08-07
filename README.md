# Info

Essential bot for streamer, who plays a lot of 150cc Lounge and want to show some stats on stream without switching to Discord. <br/>
This bot uses tmi.js in order to listen to chat and send messages. <br/>
If you already know how to set it up feel free to deploy it by yourself. (Don't forget to setup the env variables) <br/>
Main feature is having a database, which links a twitch user to a certain lounger player, <br/>
so you can search the lounge data via lounge username and twitch username.

# Setup

1. Create an account on [heroku.com](https://signup.heroku.com/).

2. Get your oAuth Token [here](https://twitchtokengenerator.com). <br/>
2.1 You are there to get a **bot chat token**.<br/>
2.2 The token you need to copy is the **ACCESS TOKEN**.<br/>

3. Click this to deploy the bot on heroku and fill out the required information. <br/>
3.1 You can name it whatever you want, so you can recognize the project if you log in to heroku.<br/>

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/kjgdhrhrrgg/twitch_bot) <br/>


4. Go to "Manage App" and then navigate to the Resources Tab.
5. Disable "web npm start" and enable "worker npm start".
6. The bot should be running 24/7 now.

# Disclaimer

This bot was created just for fun so I can play around with node.js a little bit. <br/>
I used to look up the tutorial from @colbyfayock how to code a twitch bot. <br/>
My code won't be the best, but for now it works with almost no flaws. <br/>
Feel free to commit something, if it helps improving my code! <br/>
Since this bot is just a small project of mine and I can't afford paying server costs, <br/>
so only a few Streamer are supported currently.

# Plan for the future

Command to show wr time trials (150 and 200cc) <br/>
Overlay for live scores, controlled via the twitch chat

# Support 

If you like my work and want to support me, feel free to leave a donation: https://paypal.me/kjgdhrhrrgg <br/>
