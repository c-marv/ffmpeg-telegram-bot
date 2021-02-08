const ALLOWED_USERS = process.env.ALLOWED_USERS.split(',').filter(user => user);

module.exports.logResponseTime = async (ctx, next) => {
    const start = new Date();
    await next(ctx);
    console.log(`Response time ${new Date() - start}`);
};

module.exports.auth = async (ctx, next) => {
    if (ALLOWED_USERS.length > 0 && !ALLOWED_USERS.includes(ctx.from.username)) {
        return ctx.reply("You have no permission to use this bot");
    }
    await next(ctx);
};

module.exports.deleteCommandMessage = async (ctx, next) => {
    await next(ctx);
    await ctx.deleteMessage();
};