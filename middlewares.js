const ALLOWED_USERS = process.env.ALLOWED_USERS.split(',').filter(user => user);

/**
 * Check if the user is authorized to use the bot
 * @param {import('telegraf').Context} ctx 
 * @param {Promise<void>} next 
 */
const auth = async (ctx, next) => {
    if (ALLOWED_USERS.length > 0 && !ALLOWED_USERS.includes(ctx.from.username)) {
        return ctx.reply("You don't have permission to use this bot");
    }
    await next(ctx);
};

/**
 * Log the reponse time of the command
 * @param {import('telegraf').Context} ctx 
 * @param {Promise<void>} next 
 */
const logResponseTime = async (ctx, next) => {
    const start = new Date();
    await next(ctx);
    console.log(`Response time ${new Date() - start}`);
}

/**
 * Delete the incomming message after excecute succesfully the command
 * @param {import('telegraf').Context} ctx 
 * @param {Promise<void>} next 
 */
const deleteCommandMessage = async (ctx, next) => {
    await next(ctx);
    await ctx.deleteMessage();
};

/**
 * Global error handler
 * @param {import('telegraf').Context} ctx 
 * @param {Promise<void>} next 
 */
const handlingError = async (ctx, next) => {
    try {
        await next(ctx);
    } catch (err) {
        await ctx.deleteMessage();
        console.error('Error executing the command', err);
        await ctx.reply(`ERROR: ${err.message}`);
    }
}

module.exports = {
    auth, logResponseTime, deleteCommandMessage, handlingError,
};