/**
 * jsqrcode build
 */
'use strict';

const fs = require('fs');
const path = require('path');

const jsqrcodeSrc = './js/jsqrcode';
const jsqrcodeDist = './js/jsqrcode.js';

const files = [
    'grid', 'version', 'detector', 'formatinf',
    'errorlevel', 'bitmat', 'datablock', 'bmparser',
    'datamask', 'rsdecoder', 'gf256poly', 'gf256',
    'decoder', 'qrcode', 'findpat',
    'alignpat', 'databr'
];

console.log('Read files...');

let content = files.reduce((str, name) => {
    let p = path.join(jsqrcodeSrc, name + '.js');

    str += fs.readFileSync(p).toString();
    str += '\n\n';

    return str;
}, '');

// clean & replace
content = content.trim().replace(/\r\n/g, '\n');
content += '\n';

console.log('Write file...');

fs.writeFileSync(jsqrcodeDist, content);

console.log('Done.');