const { parseCommand, convertFile, deleteFile } = require('./utils');

const FILE_FORMATS = {
    JPG: 'jpg',
    PNG: 'png',
    MP4: 'mp4',
};

/**
 * Convert incomming command from telegram to format file
 * @param {import('telegraf').Context} ctx 
 * @param {string} format 
 */
 const convert = async (ctx, format) => {
    const [command, url] = parseCommand(ctx.message.text);
    return await convertFile(url, format);
}

/**
 * Command to show welcome message
 * @param {import('telegraf').Context} ctx 
 */
const welcome = async (ctx) => {
    return ctx.reply(`Welcome ${ctx.from.first_name} to ffmpeg bot`);
};

/**
 * Command to convert to mp4
 * @param {import('telegraf').Context} ctx 
 */
const mp4 = async (ctx) => {
    const convertedFilePath = await convert(ctx, FILE_FORMATS.MP4);
    await ctx.replyWithVideo({
        source: convertedFilePath,
    });
    await deleteFile(convertedFilePath);
}

/**
 * Command to convert to jpg
 * @param {import('telegraf').Context} ctx 
 */
const jpg = async (ctx) => {
    const convertedFilePath = await convert(ctx, FILE_FORMATS.JPG);
    await ctx.replyWithPhoto({
        source: convertedFilePath,
    });
    await deleteFile(convertedFilePath);
}

/**
 * Command to convert to png
 * @param {import('telegraf').Context} ctx 
 */
const png = async (ctx) => {
    const convertedFilePath = await convert(ctx, FILE_FORMATS.PNG);
    await ctx.replyWithPhoto({
        source: convertedFilePath,
    });
    await deleteFile(convertedFilePath);
}

/**
 * Command to convert to gif
 * @param {import('telegraf').Context} ctx 
 */
const gif = async (ctx) => {
    const convertedFilePath = await convert(ctx, FILE_FORMATS.MP4);
    await ctx.replyWithAnimation({
        source: convertedFilePath,
    });
    await deleteFile(convertedFilePath);
}

module.exports = {
    welcome, mp4, jpg, png, gif,
}