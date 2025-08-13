import { Middleware, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { IBotCommand } from '../interfaces';
import { Markup } from 'telegraf';

export class IdCommand implements IBotCommand {
  getCommand(): string {
    return 'id';
  }

  handler(): Middleware<Context<Update>> {
    return async context => {
      const message = context.message;
      if (!message) return;

      // Check if the command is a reply to a message
      if (!('reply_to_message' in message) || !message.reply_to_message) {
        await context.reply(
          'This command only works when replying to a media message (photo/video/animation).'
        );
        return;
      }

      const repliedMessage = message.reply_to_message;
      let mediaInfo = '';

      // Check for photo
      if ('photo' in repliedMessage && repliedMessage.photo) {
        const photos = repliedMessage.photo;
        const largestPhoto = photos[photos.length - 1]; // Get the largest photo
        mediaInfo = `📸 Photo ID: \`photo:${largestPhoto.file_id}\`\n`;
        mediaInfo += `Size: ${largestPhoto.width}x${largestPhoto.height}\n`;
        mediaInfo += `File Size: ${largestPhoto.file_size || 'Unknown'} bytes`;
      }
      // Check for video
      else if ('video' in repliedMessage && repliedMessage.video) {
        const video = repliedMessage.video;
        mediaInfo = `🎥 Video ID: \`video:${video.file_id}\`\n`;
        mediaInfo += `Duration: ${video.duration}s\n`;
        mediaInfo += `Size: ${video.width}x${video.height}\n`;
        mediaInfo += `File Size: ${video.file_size || 'Unknown'} bytes\n`;
        if (video.mime_type) {
          mediaInfo += `MIME Type: ${video.mime_type}`;
        }
      }
      // Check for animation (GIF)
      else if ('animation' in repliedMessage && repliedMessage.animation) {
        const animation = repliedMessage.animation;
        mediaInfo = `🎞️ Animation ID: \`animation:${animation.file_id}\`\n`;
        mediaInfo += `Duration: ${animation.duration}s\n`;
        mediaInfo += `Size: ${animation.width}x${animation.height}\n`;
        mediaInfo += `File Size: ${animation.file_size || 'Unknown'} bytes\n`;
        if (animation.mime_type) {
          mediaInfo += `MIME Type: ${animation.mime_type}`;
        }
      } else {
        await context.reply(
          'The replied message does not contain any supported media (photo, video, or animation).'
        );
        return;
      }

      // Reply to the original media message with a delete button
      await context.reply(mediaInfo, {
        parse_mode: 'Markdown',
        reply_to_message_id: repliedMessage.message_id,
        ...Markup.inlineKeyboard([
          Markup.button.callback('🗑️ Delete', `delete:${context.message?.message_id}`),
        ]),
      });
    };
  }
}
