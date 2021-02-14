const utils = require('./utils');

const AVAILABLE_COMMANDS = {
    JPG: 'jpg',
    PNG: 'png',
    MP4: 'mp4',
    GIF: 'gif'
};

module.exports.welcome = (ctx) => {
    return ctx.reply(`Welcome ${ctx.from.first_name} to ffmpeg bot`);
};

module.exports.convert = async (ctx) => {
    let [command, url] = utils.parseCommand(ctx.message.text);
    let convertedFilePath;
    try {
        convertedFilePath = await utils.convertFile(url, command);
    } catch (err) {
        return ctx.reply(err.message);
    }
    const reply = {
        source: convertedFilePath
    };
    if (command == AVAILABLE_COMMANDS.JPG || command == AVAILABLE_COMMANDS.PNG) {
        ctx.replyWithPhoto(reply);
    } else if (command == AVAILABLE_COMMANDS.MP4) {
        ctx.replyWithVideo(reply);
    } else if (command == AVAILABLE_COMMANDS.GIF) {
        ctx.replyWithAnimation(reply);
    } else {
        ctx.reply('Unhandled convertion format');
    }
    await utils.deleteFile(convertedFilePath);
}