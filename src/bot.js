const crypto = require('crypto');
const Discord = require('discord.js');
const { createHaxroomie } = require('haxroomie-core');
const createRoom = require('./room');
const config = require('../config.json');

const client = new Discord.Client();

const findTokenInArgs = args => args.find(arg => arg.startsWith('thr1'));

const start = async () => {
    const haxroomie = await createHaxroomie({
        downloadDirectory: './'
    });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);

        client.user.setPresence({
            activity: {
                name: 'Haxball | !createroom !roomlist',
                type: 'PLAYING'
            },
        });
    });

    client.on('message', async message => {
        if (!message.content.startsWith(config.commandPrefix)) {
            return;
        }

        const commandBody = message.content.slice(config.commandPrefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();

        if (command === 'createroom') {
            try {
                const token = findTokenInArgs(args);

                if (!token) {
                    throw new Error(
                        'No headless token provided.\n'+
                        'You can obtain one from https://www.haxball.com/headlesstoken and then use it like\n' + 
                        '`!createroom thr1.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`'
                    );
                }

                const secret = crypto.randomBytes(20).toString('hex');

                const room = await createRoom(
                    haxroomie,
                    `${message.author.username}'s room`,
                    token,
                    secret
                );

                message.channel.send(`${message.author} created a room: ${room.roomLink}`);
                message.author.send(
                    `Your room has been created: ${room.roomLink}\n` +
                    `Enter the following command in chat to get admin: \`!verify ${secret}\``
                );
            } catch (e) {
                const errorMessage = e.message === 'id must be unique'
                    ? 'Token already used. Please obtain another from https://www.haxball.com/headlesstoken'
                    : e.message;

                message.reply(`Failed to create a room: ${errorMessage}`);
            }
        } else if (command === 'roomlist') {
            const embed = new Discord.MessageEmbed({ title: 'Room List' });
            const rooms = haxroomie.getRooms()
                .filter(room => room.hhmLoaded);

            if (!rooms.length) {
                embed.setDescription('There are no open rooms currently');
            } else {
                rooms.forEach(room => embed.addField(room.roomInfo.roomName, room.roomInfo.roomLink));
            }

            message.reply(embed);
        }
    });

    client.login(config.botToken);
};

start();
