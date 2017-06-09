#!/usr/bin/env node

const promisify = require('./utils/promisify');
const fs = require('fs-extra');
const generateElmFiles = require('./generateElmFiles');

const elmAppDir = './elm/src';
const writeFile = promisify(fs.writeFile);
const emptyDir = promisify(fs.emptyDir);

function writeElmFile(file) {
    return writeFile(`${ elmAppDir }/${ file.relativePath }`, file.content);
}

emptyDir(elmAppDir)
    .then(() => Promise.all(generateElmFiles(8).map(writeElmFile)))
    .then(() => console.log('Files generated successfully'))
    .catch(err => console.error(err));
