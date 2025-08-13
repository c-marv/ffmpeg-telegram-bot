# FFMPEG Telegram Bot

A powerful Telegram bot built with TypeScript that converts media files to different formats using FFmpeg. This bot specializes in converting images and videos to common formats like `jpg`, `png`, `gif`, and `mp4`, with particular focus on converting `webp` images and `webm` videos that may not display correctly in Telegram.

## Features

- **Media Format Conversion**: Convert images and videos from URLs to various formats
- **Media Identifier Extraction**: Get file IDs and metadata from media messages
- **Supported Input Formats**: WebP, WebM, and other media formats
- **Supported Output Formats**: JPG, PNG, GIF, MP4
- **Telegram Integration**: Native Telegram bot interface with command-based interaction
- **Flexible Deployment**: Can run as a standalone bot or with Express server for webhooks
- **User Access Control**: Optional user authorization system
- **TypeScript**: Fully typed codebase with Google TypeScript Style

## Requirements

### System Dependencies
- **Node.js**: 14.x or higher
- **Yarn**: Latest stable version (required for package management)
- **FFmpeg**: 4.2.4 or higher

### Installation

1. **Install system dependencies:**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nodejs yarn ffmpeg
   
   # macOS (with Homebrew)
   brew install node yarn ffmpeg
   
   # Arch Linux
   sudo pacman -S nodejs yarn ffmpeg
   ```

2. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd ffmpeg-telegram-bot
   cp .env.example .env
   yarn install
   ```

3. **Configure environment variables** (see Environment Variables section below)

4. **Build and run:**
   ```bash
   yarn build
   yarn start
   ```

## Environment Variables

Create a `.env` file based on `.env.example` and configure the following variables:

- **`USE_EXPRESS`**: (`true`/`false`) Determines if the bot runs with Express server for webhooks or uses polling mode
- **`BOT_TOKEN`**: Your Telegram bot token from [@BotFather](https://t.me/botfather)
- **`PORT`**: Server port for Express mode (required if `USE_EXPRESS=true`)
- **`URL`**: Public domain/URL where the bot is hosted (required if `USE_EXPRESS=true`)
- **`ALLOWED_USERS`**: Comma-separated list of authorized Telegram usernames (`user1,user2,user3`). Leave empty to allow all users

### Example Configuration
```bash
USE_EXPRESS=false
BOT_TOKEN=your_bot_token_here
PORT=3000
URL=https://your-domain.com
ALLOWED_USERS=username1,username2
```

## Development

### Available Scripts

- **`yarn start`**: Run the compiled bot
- **`yarn watch`**: Run in development mode with auto-reload
- **`yarn build`**: Compile TypeScript to JavaScript
- **`yarn lint`**: Run ESLint checks
- **`yarn fix`**: Auto-fix linting issues
- **`yarn clean`**: Clean build directory
- **`yarn ngrok`**: Expose local server via ngrok (useful for webhook testing)

### Development Workflow

1. **Development mode:**
   ```bash
   yarn watch
   ```

2. **Testing with webhooks locally:**
   ```bash
   # Terminal 1: Start the bot with Express
   USE_EXPRESS=true yarn watch
   
   # Terminal 2: Expose via ngrok
   yarn ngrok
   ```

3. **Linting and formatting:**
   ```bash
   yarn lint
   yarn fix
   ```

### Project Structure

```
src/
├── commands/          # Bot command implementations
├── interfaces/        # TypeScript interfaces
├── middlewares/       # Bot and server middlewares
├── utils/            # Utility functions (FFmpeg, file handling, etc.)
├── app.ts            # Main application orchestrator
├── bot.ts            # Telegram bot setup
├── server.ts         # Express server setup
└── index.ts          # Application entry point
```

## Deployment Modes

### Polling Mode (Default)
- Set `USE_EXPRESS=false`
- Bot connects directly to Telegram using long polling
- Suitable for development and simple deployments

### Webhook Mode
- Set `USE_EXPRESS=true`
- Requires a public URL with HTTPS
- More efficient for production deployments
- Configure `PORT` and `URL` environment variables

## Bot Commands

- `/start` - Initialize the bot and show help
- `/id` - Get media identifier when replying to a media message (photo/video/animation)
- `/jpg <url>` - Convert media from URL to JPG format
- `/png <url>` - Convert media from URL to PNG format  
- `/mp4 <url>` - Convert media from URL to MP4 format
- `/gif <url>` - Convert media from URL to GIF format
- `/get <type>:<file_id>` - Retrieve and send the respective media (photo, video, or animation) based on the provided file ID

### Usage Examples

**Media Conversion:**
```
/mp4 https://example.com/video.webm
/jpg https://example.com/image.webp
```

**Media Identifier Extraction:**
1. Find a message with supported media (photo, video, or animation)
2. Reply to that message with `/id`
3. The bot will return the file ID and metadata

**Media Retrieval:**
```
/get photo:ABC123
/get video:XYZ789
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the Google TypeScript Style
4. Run `yarn lint` and `yarn fix`
5. Submit a pull request
