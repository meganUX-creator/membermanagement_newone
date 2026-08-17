const fs = require('fs');
let html = fs.readFileSync('content.html', 'utf8');

// Find the start of the garbage injection
let startIdx = html.indexOf('<!DOCTYPE html>', html.indexOf('<!-- Card 4: 提現信息 -->'));
// Find the end of the garbage injection (where the actual withdraw section starts)
let endIdx = html.indexOf('<div class="withdraw-info-section"', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + html.substring(endIdx);
    fs.writeFileSync('content.html', html);
    console.log('Garbage removed from Card 4');
} else {
    console.log('Garbage not found');
}
