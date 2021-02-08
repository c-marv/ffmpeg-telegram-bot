const {convertFile, parseCommand} = require('./utils');

const processCommandConversion = async (message, toFormat) => {
    let [command, url] = parseCommand(message);
    return await convertFile(url, toFormat);
};

module.exports.welcome = (ctx) => {
    return ctx.reply(`Welcome ${ctx.from.first_name} to ffmpeg bot`);
};

module.exports.jpg = async (ctx) => {
    let fileStream;
    try {
        fileStream = await processCommandConversion(ctx.message.text, 'jpg');
    } catch (err) {
        return ctx.reply(err.message);
    }
    return ctx.replyWithPhoto({
        source: fileStream
    });
};

module.exports.png = async (ctx) => {
    let fileStream;
    try {
        fileStream = await processCommandConversion(ctx.message.text, 'png');
    } catch (err) {
        return ctx.reply(err.message);
    }
    return ctx.replyWithPhoto({
        source: fileStream
    });
};

module.exports.mp4 = async (ctx) => {
    let fileStream;
    try {
        fileStream = await processCommandConversion(ctx.message.text, 'mp4');
    } catch (err) {
        return ctx.reply(err.message);
    }

    return ctx.replyWithVideo({
        source: fileStream
    });
};

module.exports.gif = async (ctx) => {
    let fileStream;
    try {
        fileStream = await processCommandConversion(ctx.message.text, 'mp4');
    } catch (err) {
        return ctx.reply(err.message);
    }
    return ctx.replyWithAnimation({
        source: fileStream
    });
};