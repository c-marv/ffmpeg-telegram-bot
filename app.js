require('dotenv').config()
const {Telegraf} = require('telegraf');
const express = require('express');
const middlewares = require('./middlewares');
const commands = require('./commands');
const {checkFFMPEG, ensureTempFolder} = require('./utils');

app = express();
ensureTempFolder();

const USE_EXPRESS = process.env.USE_EXPRESS == 'true';
const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT;
const URL = process.env.URL;

const bot = new Telegraf(BOT_TOKEN);
if (USE_EXPRESS) {
    bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
    app.use(bot.webhookCallback(`/bot${BOT_TOKEN}`));
}

bot.use(middlewares.logResponseTime);
bot.use(middlewares.auth);
bot.use(middlewares.deleteCommandMessage);

bot.start(commands.welcome);
bot.command('jpg', commands.jpg);
bot.command('mp4', commands.mp4);
bot.command('gif', commands.gif);
bot.command('png', commands.png);

if (USE_EXPRESS) {
    app.get('/', async (req, res) => {
        let ffmpegIsInstalled = await checkFFMPEG();
        res.send(`ffmpeg telegram bot status: UP, ffmpeg is installed: ${ffmpegIsInstalled ? 'YES' : 'NO'}`);
    });
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} else {
    bot.launch();

    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
}