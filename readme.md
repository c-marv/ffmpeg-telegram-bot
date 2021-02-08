### FFMPEG telegram bot

Basic telegram bot to convert url images or videos to other formats: `jpg, png, gif, mp4`. Mainly the `webp` and `webm`, because sometimes these are not displayed correctly in Telegram.

### DotEnv variables
- **USE_EXPRESS**: Determines if the bot will run using express or not. 
- **BOT_TOKEN**: Token generated using the official telegram bot [@BotFather](https://t.me/botfather)
- **PORT**: Listen port for express. Only required if `USE_EXPRESS=true`
- **URL**: Domain where is hosted the bot. Only required if `USE_EXPRESS=true`
- **ALLOWED_USERS**: Usernames authorized to use the bot. Must be separated by commas (`username1,username2,username3`). If it is empty, the validation is not performed.

### Run Bot
```shell
$ cp .env.example .env
$ npm install
$ npm start
```