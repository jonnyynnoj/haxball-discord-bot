# Haxball Room Host Discord Bot

Create vps haxball hosts directly from discord.

## Running

You will first need to create a discord bot through the [developer portal](https://discord.com/developers/applications) and then add it to your server.

Clone the repository somewhere:

```
git clone https://github.com/jonnyynnoj/haxball-discord-bot.git /app
cd /app
touch config.json
```

Fill `config.json` with the following contents, entering the token for your bot:

```
{
    "botToken": "your bot token here",
    "commandPrefix": "!"
}
```

Then start:

```
yarn start
```
