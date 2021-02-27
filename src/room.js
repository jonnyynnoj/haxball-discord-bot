const createRoom = async (haxroomie, token, secret) => {
    const roomController = await haxroomie.addRoom(token);

    return roomController.openRoom({
        roomName: 'haxroomie',
        maxPlayers: 10,
        public: false,
        noPlayer: true,
        pluginConfig: {
            'sav/commands': {}
        },
        roomScript: {
            name: 'haxball-discord-bot/commands',
            content: getRoomScriptContent(secret),
        },
        token
    });
};

function getRoomScriptContent(secret) {
    return `
        const room = HBInit();
        room.pluginSpec = {
            name: 'haxball-discord-bot/commands',
            author: 'noj',
            version: '1.0.0',
            dependencies: [
                'sav/commands'
            ]
        };

        let verified = false;

        room.onCommand1_verify = (player, arguments) => {
            if (verified) {
                return false;
            }

            const verification = arguments[0];
            if (verification === '${secret}') {
                room.setPlayerAdmin(player.id, true);
                verified = true;
            }

            return false;
        };
    `;
}

module.exports = createRoom;