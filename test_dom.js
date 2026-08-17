const fs = require('fs');
const html = fs.readFileSync('content.html', 'utf8');

let divOpen = 0;
let lines = html.split('\n');
for(let i=0; i<lines.length; i++) {
    let openCount = (lines[i].match(/<div[^>]*>/g) || []).length;
    let closeCount = (lines[i].match(/<\/div>/g) || []).length;
    divOpen += (openCount - closeCount);
    if(divOpen < 0) {
        console.log(`Mismatch at line ${i+1}: open ${divOpen}`);
    }
}
console.log('Final open count:', divOpen);
