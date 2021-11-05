const Fs = require('fs');
const Path = require('path');
const Axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

/**
 * Validate if the url is valid
 * @param {string} url 
 * @returns {boolean}
 */
const isValidUrl = (url) => {
    if (!url) {
        return false;
    }
    return url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);
};

/**
 * Download a file from an url
 * @param {string} url 
 * @returns {Promise<string>} 
 */
const downloadFile = async (url) => {
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

/**
 * Execute a command
 * @param {string} commmand 
 * @returns {Promise<string>}
 */
const execShellCommand = (commmand) => {
    return new Promise((resolve, reject) => {
        exec(commmand, (err, stdout, stderr) => {
            if (err) {
                return reject(stderr);
            }
            return resolve(stdout);
        });
    });
};

/**
 * Execute a ffmpeg to convert a file (file path) to another format file
 * @param {string} filePath 
 * @param {string} toFormat 
 * @returns {Promise<string>}
 */
const ffmpeg = async (filePath, toFormat) => {
    const newFilePath = Path.resolve(__dirname, 'tmp', `${uuidv4()}.${toFormat}`);
    if (!Fs.existsSync(filePath)) {
        throw new Error(`${filePath} file not found`);
    }
    try {
        await execShellCommand(`ffmpeg -i ${filePath} ${newFilePath}`);
    } catch (err) {
        throw new Error(`error converting file [${err}]`);
    }
    return newFilePath;
};

/**
 * Deletes the from path parameter
 * @param {string} path 
 */
const deleteFile = async (path) => {
    new Promise((resolve, reject) => {
        Fs.unlink(path, (err) => {
            if (err) {
                console.warn(`error to delete file ${path}`);
                return reject(err);
            };
            return resolve();
        });
    });
};

/**
 * Parse command from string to command and file url
 * @param {string} command 
 * @returns {Array}
 */
const parseCommand = (command) => {
    const params = command.split(/ +/);
    if (params.length !== 2) {
        throw new Error('You must pass the command and the image url, eg: /mp4 https://foo.bar/baz.webm');
    }
    return params;
};

/**
 * Converts a file (url) to another format file
 * @param {string} url 
 * @param {string} toFormat 
 * @returns {Promise<string>}
 */
const convertFile = async (url, toFormat) => {
    if (!isValidUrl(url)) {
        throw new Error('pass a valid url image');
    }
    // download file locally
    let downloadFilePath;
    try {
        downloadFilePath = await downloadFile(url);
    } catch (err) {
        throw new Error('error to download image');
    }
    // convert file using ffmpeg
    let convertedFilePath;
    try {
        convertedFilePath = await ffmpeg(downloadFilePath, toFormat);
    } catch (err) {
        await deleteFile(downloadFilePath);
        throw new Error('error to convert image');
    }
    await deleteFile(downloadFilePath);
    return convertedFilePath;
};

/**
 * Check or create the temporal folder `/tmp`
 */
const ensureTempFolder = () => {
    if (!Fs.existsSync('./tmp')) {
        Fs.mkdirSync('./tmp');
    }
};

/**
 * Checks if ffmpeg is installed
 * @returns {Promise<boolean>}
 */
const checkFFMPEG = async () => {
    try {
        await execShellCommand('ffmpeg -version');
        return true;
    } catch (err) {
        console.warn(err);
        return false;
    }
};

module.exports = {
    isValidUrl,
    downloadFile,
    execShellCommand,
    ffmpeg,
    deleteFile,
    parseCommand,
    convertFile,
    ensureTempFolder,
    checkFFMPEG,
}