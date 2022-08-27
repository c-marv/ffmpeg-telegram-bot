import {Update} from 'telegraf/typings/core/types/typegram';

export type TelegramMessage = (Update & {text: string}) | undefined;
