const fs = require('fs');
let content = fs.readFileSync('script.js', 'utf8');

content = content.replace(
    /if \(userDetailsDrawer\) userDetailsDrawer.classList.remove\('active'\);/,
    `if (userDetailsDrawer) {
            userDetailsDrawer.classList.remove('active');
            const expandPanel = document.getElementById('detailsExpandPanel');
            setTimeout(() => {
                userDetailsDrawer.style.width = '960px';
                if (expandPanel) expandPanel.style.display = 'none';
            }, 300);
        }`
);

fs.writeFileSync('script.js', content, 'utf8');
