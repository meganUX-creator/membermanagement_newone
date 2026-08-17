const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf8');

const resetLogicOld = `const rowIp = document.getElementById('rowIpLoginCount');
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
        if (hintDevice) hintDevice.style.display = 'block';`;

const resetLogicNew = `const rowIp = document.getElementById('rowIpLoginCount');
        const rowDevice = document.getElementById('rowDeviceLoginCount');
        const btnIp = document.getElementById('btnIpExpand');
        const btnDevice = document.getElementById('btnDeviceExpand');
        const hintIp = document.getElementById('hintIpExpand');
        const hintDevice = document.getElementById('hintDeviceExpand');
        
        const rowRegIp = document.getElementById('rowRegIpLoginCount');
        const rowRegDevice = document.getElementById('rowRegDeviceLoginCount');
        const btnRegIp = document.getElementById('btnRegIpExpand');
        const btnRegDevice = document.getElementById('btnRegDeviceExpand');
        const hintRegIp = document.getElementById('hintRegIpExpand');
        const hintRegDevice = document.getElementById('hintRegDeviceExpand');
        
        if (rowIp) { rowIp.style.background = 'transparent'; rowIp.style.borderColor = 'transparent'; }
        if (rowDevice) { rowDevice.style.background = 'transparent'; rowDevice.style.borderColor = 'transparent'; }
        if (btnIp) btnIp.style.display = 'none';
        if (btnDevice) btnDevice.style.display = 'none';
        if (hintIp) hintIp.style.display = 'block';
        if (hintDevice) hintDevice.style.display = 'block';

        if (rowRegIp) { rowRegIp.style.background = 'transparent'; rowRegIp.style.borderColor = 'transparent'; }
        if (rowRegDevice) { rowRegDevice.style.background = 'transparent'; rowRegDevice.style.borderColor = 'transparent'; }
        if (btnRegIp) btnRegIp.style.display = 'none';
        if (btnRegDevice) btnRegDevice.style.display = 'none';
        if (hintRegIp) hintRegIp.style.display = 'block';
        if (hintRegDevice) hintRegDevice.style.display = 'block';`;

// Update reset logic inside openDetailedContentDrawer and btnDetailsExpandClose
content = content.replace(resetLogicOld, resetLogicNew);
content = content.replace(resetLogicOld, resetLogicNew); // Run again for the second instance (close logic)

const activeLogicOld = `const activeRow = type === 'ip' ? rowIp : rowDevice;
        const activeBtn = type === 'ip' ? btnIp : btnDevice;
        const activeHint = type === 'ip' ? hintIp : hintDevice;`;

const activeLogicNew = `let activeRow = null;
        let activeBtn = null;
        let activeHint = null;
        if (type === 'ip') { activeRow = rowIp; activeBtn = btnIp; activeHint = hintIp; }
        else if (type === 'device') { activeRow = rowDevice; activeBtn = btnDevice; activeHint = hintDevice; }
        else if (type === 'reg_ip') { activeRow = rowRegIp; activeBtn = btnRegIp; activeHint = hintRegIp; }
        else if (type === 'reg_device') { activeRow = rowRegDevice; activeBtn = btnRegDevice; activeHint = hintRegDevice; }`;

content = content.replace(activeLogicOld, activeLogicNew);

const renderLogicEnd = `}
    };`;

const additionalRenderLogic = `} else if (type === 'reg_ip') {
            contentDiv.innerHTML = \`
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
                    <thead>
                        <tr style="background-color: #f8fafc; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">
                            <th style="padding: 12px 16px; font-weight: 600;">登錄</th>
                            <th style="padding: 12px 16px; font-weight: 600;">註冊時間</th>
                            <th style="padding: 12px 16px; font-weight: 600;">IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 16px;">megan002</td>
                            <td style="padding: 16px; font-family: monospace;">2026-05-10 10:12:00</td>
                            <td style="padding: 16px; font-family: monospace; color: #475569;">54.150.111.152 <i class="ph ph-copy" style="color: #94a3b8; cursor: pointer;"></i></td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 16px;">reg_bot_01</td>
                            <td style="padding: 16px; font-family: monospace;">2026-05-10 10:14:20</td>
                            <td style="padding: 16px; font-family: monospace; color: #475569;">54.150.111.152 <i class="ph ph-copy" style="color: #94a3b8; cursor: pointer;"></i></td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 16px;">reg_bot_02</td>
                            <td style="padding: 16px; font-family: monospace;">2026-05-10 10:15:11</td>
                            <td style="padding: 16px; font-family: monospace; color: #475569;">54.150.111.152 <i class="ph ph-copy" style="color: #94a3b8; cursor: pointer;"></i></td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 16px;">user_japan_1</td>
                            <td style="padding: 16px; font-family: monospace;">2026-05-09 18:30:00</td>
                            <td style="padding: 16px; font-family: monospace; color: #475569;">54.150.111.152 <i class="ph ph-copy" style="color: #94a3b8; cursor: pointer;"></i></td>
                        </tr>
                    </tbody>
                </table>
            \`;
        } else if (type === 'reg_device') {
            contentDiv.innerHTML = \`
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
                    <thead>
                        <tr style="background-color: #f8fafc; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">
                            <th style="padding: 12px 16px; font-weight: 600;">登錄</th>
                            <th style="padding: 12px 16px; font-weight: 600;">註冊時間</th>
                            <th style="padding: 12px 16px; font-weight: 600;">設備號</th>
                            <th style="padding: 12px 16px; font-weight: 600;">IP信息</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 16px;">megan002</td>
                            <td style="padding: 16px; font-family: monospace;">2026-05-10<br>10:12:00</td>
                            <td style="padding: 16px; font-family: monospace; color: #475569;">ee5868d85af7f68cf088a... <i class="ph ph-copy" style="color: #94a3b8; cursor: pointer;"></i></td>
                            <td style="padding: 16px; color: #64748b;"><i class="ph-fill ph-map-pin"></i> 日本東京都<br>東京</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 16px;">clone_device_01</td>
                            <td style="padding: 16px; font-family: monospace;">2026-05-10<br>10:20:00</td>
                            <td style="padding: 16px; font-family: monospace; color: #475569;">ee5868d85af7f68cf088a... <i class="ph ph-copy" style="color: #94a3b8; cursor: pointer;"></i></td>
                            <td style="padding: 16px; color: #64748b;"><i class="ph-fill ph-map-pin"></i> 日本東京都<br>東京</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 16px;">clone_device_02</td>
                            <td style="padding: 16px; font-family: monospace;">2026-05-10<br>10:22:45</td>
                            <td style="padding: 16px; font-family: monospace; color: #475569;">ee5868d85af7f68cf088a... <i class="ph ph-copy" style="color: #94a3b8; cursor: pointer;"></i></td>
                            <td style="padding: 16px; color: #64748b;"><i class="ph-fill ph-map-pin"></i> 日本東京都<br>東京</td>
                        </tr>
                    </tbody>
                </table>
            \`;
        }
    };`;

content = content.replace(/        \}\n    \};\n\n    const btnDetailsExpandClose = /m, '        ' + additionalRenderLogic + '\n\n    const btnDetailsExpandClose = ');

fs.writeFileSync('script.js', content, 'utf8');
