const fs = require('fs');

const html = fs.readFileSync('content.html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');

const dom = require('jsdom');
