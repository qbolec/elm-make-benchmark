#!/usr/bin/env node

const promisify = require('./utils/promisify');
const fs = require('fs-extra');
const generateElmFiles = require('./generateElmFiles');

const elmAppDir = './elm/src';
const writeFile = promisify(fs.writeFile);
const emptyDir = promisify(fs.emptyDir);

const depth = +process.argv[2];
const templateName = process.argv[3];

function writeElmFile(file) {
    return writeFile(`${ elmAppDir }/${ file.relativePath }`, file.content);
}

emptyDir(elmAppDir)
    .then(() => Promise.all(generateElmFiles(depth, templateName).map(writeElmFile)))
    .then(() => console.log('Files generated successfully'))
    .catch(err => console.error(err));
