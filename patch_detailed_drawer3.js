const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf8');

const resetLogic = `
            const rowIp = document.getElementById('rowIpLoginCount');
            const rowDevice = document.getElementById('rowDeviceLoginCount');
            const btnIp = document.getElementById('btnIpExpand');
            const btnDevice = document.getElementById('btnDeviceExpand');
            const hintIp = document.getElementById('hintIpExpand');
            const hintDevice = document.getElementById('hintDeviceExpand');
            if (rowIp) { rowIp.style.background = 'transparent'; rowIp.style.borderColor = 'transparent'; }
            if (rowDevice) { rowDevice.style.background = 'transparent'; rowDevice.style.borderColor = 'transparent'; }
            if (btnIp) btnIp.style.display = 'none';
            if (btnDevice) btnDevice.style.display = 'none';
            if (hintIp) hintIp.style.display = 'block';
            if (hintDevice) hintDevice.style.display = 'block';
`;

content = content.replace(
    /if \(expandPanel\) \{[\s\S]*?setTimeout\(\(\) => \{ expandPanel\.style\.display = 'none'; \}, 300\);/g,
    `if (expandPanel) {
                setTimeout(() => { 
                    expandPanel.style.display = 'none'; 
                    userDetailsDrawer.style.maxWidth = '90vw';
                }, 300);
            }
            ${resetLogic}`
);

fs.writeFileSync('script.js', content, 'utf8');
