const inactiveMinutes = 10;

const closeRoomAfterInactivePeriod = (roomController, haxroomie) => {
    const createTimeout = () => {
        return setTimeout(async () => {
            await roomController.closeRoom();
            haxroomie.removeRoom(roomController.id);
        }, inactiveMinutes * 1000 * 60);
    };

    let timeout = createTimeout();

    return () => {
        clearTimeout(timeout);
        timeout = createTimeout();
    };
}

const createRoom = async (haxroomie, roomName, token, secret) => {
    const roomController = await haxroomie.addRoom(token);

    const roomConfig = {
        maxPlayers: 20,
        public: false,
        noPlayer: true,
        pluginConfig: {
            'sav/commands': {}
        },
        roomScript: {
            name: 'haxball-discord-bot/commands',
            content: getRoomScriptContent(secret),
        },
        roomName,
        token,
    };

    try {
        const room = await roomController.openRoom(roomConfig);
    } catch (e) {
        return haxroomie.removeRoom(token);
    }

    const resetTimeout = closeRoomAfterInactivePeriod(roomController, haxroomie);

    roomController.on('room-event', () => {
        resetTimeout();
    });

    return room;
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