const Discord = require('discord.js');
const { createHaxroomie } = require('haxroomie-core');
const config = require('../config.json');

const client = new Discord.Client();
const commandPrefix = '!';

const createRoom = async (haxroomie, token) => {
    const room = await haxroomie.addRoom('example');

    return room.openRoom({
        roomName: 'haxroomie',
        maxPlayers: 10,
        public: false,
        noPlayer: true,
        token
    });
};

const findTokenInArgs = args => args.find(arg => arg.startsWith('thr1'));

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
                const token = findTokenInArgs(args);

                if (!token) {
                    throw new Error('No headless token provided');
                }

                const room = await createRoom(haxroomie, token);
                message.reply(`Here's your room link: ${room.roomLink}`);
            } catch (e) {
                message.reply(`Failed to create a room: ${e.message}`);
            }
        }
    });

    client.login(config.botToken);
};

start();
