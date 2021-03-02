# Haxball Room Host Discord Bot

Create vps haxball hosts directly from discord.

## Running

You will first need to create a discord bot through the [developer portal](https://discord.com/developers/applications) and then add it to your server.

Clone the repository somewhere:

```
git clone https://github.com/jonnyynnoj/haxball-discord-bot.git /app
cd /app
yarn install
touch config.json
```

Fill `config.json` with the following contents, entering the token for your bot:

```json
{
    "botToken": "your bot token here",
    "commandPrefix": "!",
    "roomOptions": {}
}
```

`roomOptions` follows the same structure as the [haxroomie config](https://morko.github.io/haxroomie/tutorial-haxroomie-cli-config.html) for a single room, ie:

```json
"roomOptions": {
    "repositories": [{
        "type": "github",
        "repository": "morko/hhm-sala-plugins",
    }],
    "pluginConfig": {
        "hr/pause": {}
    }
}
```

Then start:

```
yarn start
```
