import {config} from 'dotenv';
import {Application} from './app';
import {Bot} from './bot';
import {Server} from './server';
import {FileUtils} from './utils';

const initialize = () => {
  config();
  FileUtils.ensureTmpFolder();
  const USE_EXPRESS = process.env.USE_EXPRESS === 'true';
  const BOT_TOKEN = process.env.BOT_TOKEN || '';
  const PORT = parseInt(process.env.PORT || '');
  const URL = process.env.URL || '';
  const ALLOWED_USERS =
    process.env.ALLOWED_USERS?.split(',').filter(user => user) || [];

  const application = new Application(
    USE_EXPRESS,
    URL,
    new Bot(BOT_TOKEN),
    new Server(PORT),
    ALLOWED_USERS
  );
  application.start();
};

initialize();
