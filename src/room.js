const config = require('../config.json');

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
    
    const roomOptions = {
        public: false,
        noPlayer: true,
        roomScript: {
            name: 'haxball-discord-bot/commands',
            content: getRoomScriptContent(secret),
        },
        roomName,
        token,
        ...config.roomOptions
    };

    let room;
    try {
        room = await roomController.openRoom(roomOptions);
    } catch (e) {
        await haxroomie.removeRoom(token);
        throw e;
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