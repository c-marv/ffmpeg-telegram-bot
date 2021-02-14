const Fs = require('fs');
const Path = require('path');
const Axios = require('axios');
const {v4: uuidv4} = require('uuid');
const {exec} = require('child_process');

module.exports.isValidUrl = (url) => {
    if (!url) {
        return false;
    }
    return url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);
};

module.exports.downloadFile = async (url) => {
    let response;
    try {
        response = await Axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });
    } catch (error) {
        throw Error('error downloading file');
    }

    const contentType = response.data.headers['content-type'];
    const fileExtension = contentType.split('/')[1];
    const path = Path.resolve(__dirname, 'tmp', `${uuidv4()}.${fileExtension}`);

    response.data.pipe(Fs.createWriteStream(path));

    return new Promise((resolve, rejects) => {
        response.data.on('end', () => {
            resolve(path);
        });
        response.data.on('error', () => {
            rejects();
        });
    });
};

module.exports.execShellCommand = (commmand) => {
    return new Promise((resolve, reject) => {
        exec(commmand, (err, stdout, stderr) => {
            if (err) {
                return reject(stderr);
            }
            return resolve(stdout);
        });
    });
};

module.exports.ffmpeg = async (filePath, toFormat) => {
    const newFilePath = Path.resolve(__dirname, 'tmp', `${uuidv4()}.${toFormat}`);
    if (!Fs.existsSync(filePath)) {
        throw new Error(`${filePath} file not found`);
    }
    try {
        await this.execShellCommand(`ffmpeg -i ${filePath} ${newFilePath}`);
    } catch (err) {
        throw new Error(`error converting file [${err}]`);
    }
    return newFilePath;
};

module.exports.deleteFile = async (path) => {
    new Promise((resolve, reject) => {
        Fs.unlink(path, (err) => {
            if (err) {
                console.warn(`error to delete file ${path}`);
            };
            return resolve();
        });
    });
};

module.exports.parseCommand = (command) => {
    let params = command.split(/ +/);
    if (params.length < 2) {
        throw new Error('pass a image url as argument');
    }
    return [
        params[0].substring(1),
        params[1]
    ];
};

module.exports.convertFile = async (url, toFormat) => {
    if (!this.isValidUrl(url)) {
        throw new Error('pass a valid url image');
    }
    // download file locally
    let downloadFilePath;
    try {
        downloadFilePath = await this.downloadFile(url);
    } catch (err) {
        throw new Error('error to download image');
    }
    // convert file using ffmpeg
    let convertedFilePath;
    try {
        convertedFilePath = await this.ffmpeg(downloadFilePath, toFormat);
    } catch (err) {
        await this.deleteFile(downloadFilePath);
        throw new Error('error to convert image');
    }
    await this.deleteFile(downloadFilePath);
    return convertedFilePath;
};

module.exports.ensureTempFolder = () => {
    if (!Fs.existsSync('./tmp')) {
        Fs.mkdirSync('./tmp');
    }
};

module.exports.checkFFMPEG = async () => {
    try {
        await this.execShellCommand('ffmpeg -version');
        return true;
    } catch (err) {
        console.warn(err);
        return false;
    }
};