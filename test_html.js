const fs = require('fs');
let html = fs.readFileSync('content.html', 'utf8');

const lines = html.split('\n');
let divOpen = 0;
for (let i = 535; i < 645; i++) {
    let line = lines[i];
    let openCount = (line.match(/<div[^>]*>/g) || []).filter(m => !m.endsWith('/>')).length;
    let closeCount = (line.match(/<\/div>/g) || []).length;
    divOpen += (openCount - closeCount);
    console.log(`Line ${i+1}: open ${openCount}, close ${closeCount}, total ${divOpen} | ${line.trim()}`);
}
