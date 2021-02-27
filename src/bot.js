const Discord = require('discord.js');
const { createHaxroomie } = require('haxroomie-core');
const config = require('../config.json');

const client = new Discord.Client();
const commandPrefix = '!';

const createRoom = async (haxroomie, token) => {
    const room = await haxroomie.addRoom(token);

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
                    throw new Error(
                        'No headless token provided.\n'+
                        'You can obtain one from https://www.haxball.com/headlesstoken and then use it like\n' + 
                        '`!createroom thr1.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`'
                    );
                }

                const room = await createRoom(haxroomie, token);
                message.reply(`Here's your room link: ${room.roomLink}`);
            } catch (e) {
                const errorMessage = e.message === 'id must be unique'
                    ? 'Token already used. Please obtain another from https://www.haxball.com/headlesstoken'
                    : e.message;

                message.reply(`Failed to create a room: ${errorMessage}`);
                console.log(e);
            }
        }
    });

    client.login(config.botToken);
};

start();
