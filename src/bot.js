const Discord = require('discord.js');
const { createHaxroomie } = require('haxroomie-core');
const config = require('../config.json');

const client = new Discord.Client();
const commandPrefix = '!';

const createRoom = async (haxroomie) => {
    const room = await haxroomie.addRoom('example');

    return room.openRoom({
        roomName: 'haxroomie',
        playerName: 'host',
        maxPlayers: 10,
        public: false,
        token: process.env.HAXBALL_TOKEN
    });
};

const start = async () => {
    const haxroomie = await createHaxroomie({
        downloadDirectory: './'
    });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', async message => {
        if (!message.content.startsWith(commandPrefix)) {
            return;
        }

        const commandBody = message.content.slice(commandPrefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();

        if (command == 'createroom') {
            try {
                const room = await createRoom(haxroomie);
                message.reply(`Here's your room link: ${room.roomLink}`);
            } catch (e) {
                message.reply(`Failed to create a room: ${e.message}`);
            }
        }
    });

    client.login(config.botToken);
};

start();
