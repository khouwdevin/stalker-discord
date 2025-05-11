# Stalker Bot

> This is Stalker Bot.

clone from [Discord.js v14 Bot Template](https://github.com/MericcaN41/discordjs-v14-template-ts)

## Stalker

<h3 align="center">Stalker</h3>

<div align="center">
  <img src="https://github.com/khouwdevin/stalker-discord/blob/master/images/spy.png" height="300px"/>
</div>

<h3 align="center">Stalker's Presence</h3>

<div align="center">
  <img src="https://github.com/khouwdevin/stalker-discord/blob/master/images/stalker-presence.png"/>
</div>

## How to Use Stalker Bot

### 1. Clone This Repository

```sh
git clone https://github.com/khouwdevin/stalker-discord.git
```

### 2. Set up

#### Set Up Environment Variables

put the environment variables inside working directory and name the file to .env

```env
TOKEN=(Discord bot token)
CLIENT_ID=(Discord client id)
PREFIX_COMMAND=$ # default prefix is $
MONGO_DATABASE_NAME=(Mongo Database name) # default mongo:27017
MONGO_USERNAME=(Mongo username for connecting)
MONGO_PASSWORD=(Mongo password for connectiong)
STALKER_DATABASE=(DB name in Mongo DB) # default stalker
LAVALINK_PASSWORD=(Lavalink password)
LAVALINK_PORT=(Lavalink port) # default 443
LAVALINK_HOST=(Lavalink host or domain that used by Lavalink server) # default lavalink
LAVALINK_IDENTIFIER=(Fill it same as lavalink host) # default lavalink-local
LAVALINK_SSL=(Fill with true if using ssl and false if not)
SPOTIFY_CLIENTID=(Spotify client id) # if you don't want to use spotify then let it empty
SPOTIFY_CLIENT_SECRET=(Spotify client secret) # if you don't want to use spotify then let it empty
TURN_ON_MUSIC=(true or false)
YOUTUBE_REFRESH_TOKEN=(Youtube refresh token) # get the token from lavalink, further explaination below
```

> you can get Spotify client id and client secret from https://developer.spotify.com
> please fill the default and if you wish to change the variable please check for docker-compose.yml

### 4. Set up Lavalink

1. download plugins, by default Stalker Bot use 2 plugins lavasrc and youtube, place the (plugin).jar into ./plugins

2. change the application.yml if you add more plugins

### 5. Run the service

Stalker bot is designed to run with docker, but if you wish to run it with external lavalink or external mongodb, please update the docker compose to suit your needs.

```sh
# if you use Linux add sudo if not just use this command
# run the command on root of this project
docker compose up -d
```

Enter the logs of lavalink, it will appear for you to initialize OAuth for Youtube as like the plugin says, do not use main account, use your burner account.

After you logged in, find the refresh token and paste into your .env, then restart the docker.

Everything should be okay and you can start use the bot, if you find any trouble please open an issue, I will happy to help.

### Contributing

If you find any bugs and you want to contribute, please open PR or an issue first, but if you wish to add new features, please fork this repo do not create PR or issues.
