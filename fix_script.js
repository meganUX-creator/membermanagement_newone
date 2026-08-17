const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// The bad code string that got inserted inside detailsLogin.
// Let's find the exact block and replace it back to what it should be.
// In detailsLogin, we had:
// 54.150.111.152 <span style="color: #94a3b8; font-family: sans-serif; font-size: 13px;">(Japan, Tokyo, Tokyo (日本東京都東京))</span> <i class="ph ph-copy" style="color: #94a3b8; cursor: pointer;"></i>
// </div>
// </div>

// After that, it should have been:
/*
                <div style="display: grid; grid-template-columns: 160px 1fr; border-bottom: 1px solid var(--border-color);">
                    <div style="padding: 16px 24px; color: var(--text-muted); font-size: 14px; display: flex; align-items: center; justify-content: flex-end;">登錄時間:</div>
                    <div style="padding: 16px 24px; font-size: 14px; font-family: monospace;">2026-07-28 16:30:42</div>
                </div>
                
                <div id="rowIpLoginCount" style="margin-top: 16px; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; border: 1px solid transparent; transition: all 0.2s;">
                    <div style="font-size: 14px; color: var(--text-muted);">
                        同IP登錄人數: <a href="#" onclick="openDetailedContentDrawer(event, 'ip')" style="font-size: 18px; font-weight: 600; color: #3b82f6; text-decoration: underline;">4,703 <i class="ph ph-arrow-square-out" style="font-size: 16px;"></i></a>
                    </div>
                    <div id="btnIpExpand" style="display: none;">
                        <button class="btn btn-primary" onclick="openDetailedContentDrawer(event, 'ip')" style="background-color: #6366f1; border: none; border-radius: 16px; padding: 4px 12px; font-size: 13px;">展開中 &gt;</button>
                    </div>
                    <div id="hintIpExpand" style="font-size: 13px; color: #94a3b8; display: block;">點擊展開右側明細</div>
                </div>
*/

// Let's use regex to surgically remove the bad block in detailsLogin
const regexBadBlock = /                   \/\/ Tab 4: 註冊IP[\s\S]*?\}"font-size: 13px; color: #94a3b8; display: block;">點擊展開右側明細<\/div>\n                <\/div>/;

const correctDetailsLoginRest = `                <div style="display: grid; grid-template-columns: 160px 1fr; border-bottom: 1px solid var(--border-color);">
                    <div style="padding: 16px 24px; color: var(--text-muted); font-size: 14px; display: flex; align-items: center; justify-content: flex-end;">登錄時間:</div>
                    <div style="padding: 16px 24px; font-size: 14px; font-family: monospace;">2026-07-28 16:30:42</div>
                </div>
                
                <div id="rowIpLoginCount" style="margin-top: 16px; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; border: 1px solid transparent; transition: all 0.2s;">
                    <div style="font-size: 14px; color: var(--text-muted);">
                        同IP登錄人數: <a href="#" onclick="openDetailedContentDrawer(event, 'ip')" style="font-size: 18px; font-weight: 600; color: #3b82f6; text-decoration: underline;">4,703 <i class="ph ph-arrow-square-out" style="font-size: 16px;"></i></a>
                    </div>
                    <div id="btnIpExpand" style="display: none;">
                        <button class="btn btn-primary" onclick="openDetailedContentDrawer(event, 'ip')" style="background-color: #6366f1; border: none; border-radius: 16px; padding: 4px 12px; font-size: 13px;">展開中 &gt;</button>
                    </div>
                    <div id="hintIpExpand" style="font-size: 13px; color: #94a3b8; display: block;">點擊展開右側明細</div>
                </div>`;

code = code.replace(regexBadBlock, correctDetailsLoginRest);


// Now replace the actual detailsReg block
const regexOldReg = /\/\/ Tab 4: 註冊IP\n        const detailsReg = document\.getElementById\('detailsReg'\);\n        if \(detailsReg\) \{\n            detailsReg\.innerHTML = `[\s\S]*?<\/div>`;\n        \}/;

const newReg = `// Tab 4: 註冊IP
        const detailsReg = document.getElementById('detailsReg');
        if (detailsReg) {
            detailsReg.innerHTML = \`
            <h4 style="margin: 0 0 16px 0; font-size: 18px; color: #3b82f6;">註冊IP</h4>
            <div style="background: #ffffff;">
                <div style="display: grid; grid-template-columns: 160px 1fr; border-bottom: 1px solid var(--border-color);">
                    <div style="padding: 16px 24px; color: var(--text-muted); font-size: 14px; display: flex; align-items: center; justify-content: flex-end;">註冊IP:</div>
                    <div style="padding: 16px 24px; font-size: 14px; font-family: monospace; display: flex; align-items: center; gap: 8px;">
                        54.150.111.152 <span style="color: #94a3b8; font-family: sans-serif; font-size: 13px;">(日本東京都東京)</span> <i class="ph ph-copy" style="color: #94a3b8; cursor: pointer;"></i>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 160px 1fr; border-bottom: 1px solid var(--border-color);">
                    <div style="padding: 16px 24px; color: var(--text-muted); font-size: 14px; display: flex; align-items: center; justify-content: flex-end;">設備號:</div>
                    <div style="padding: 16px 24px; font-size: 14px; font-family: monospace; display: flex; align-items: center; justify-content: space-between;">
                        <span>ee5868d85af7f68cf088a6780ff8882a</span>
                        <i class="ph ph-copy" style="color: #94a3b8; cursor: pointer;"></i>
                    </div>
                </div>
                
                <div id="rowRegIpLoginCount" style="margin-top: 16px; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; border: 1px solid transparent; transition: all 0.2s;">
                    <div style="font-size: 14px; color: var(--text-muted);">
                        同IP註冊人數: <a href="#" onclick="openDetailedContentDrawer(event, 'reg_ip')" style="font-size: 18px; font-weight: 600; color: #3b82f6; text-decoration: underline;">3,412 <i class="ph ph-arrow-square-out" style="font-size: 16px;"></i></a>
                    </div>
                    <div id="btnRegIpExpand" style="display: none;">
                        <button class="btn btn-primary" onclick="openDetailedContentDrawer(event, 'reg_ip')" style="background-color: #6366f1; border: none; border-radius: 16px; padding: 4px 12px; font-size: 13px;">展開中 &gt;</button>
                    </div>
                    <div id="hintRegIpExpand" style="font-size: 13px; color: #94a3b8; display: block;">點擊展開右側明細</div>
                </div>
                
                <div id="rowRegDeviceLoginCount" style="margin-top: 8px; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; border: 1px solid transparent; transition: all 0.2s;">
                    <div style="font-size: 14px; color: var(--text-muted);">
                        同設備註冊人數: <a href="#" onclick="openDetailedContentDrawer(event, 'reg_device')" style="font-size: 18px; font-weight: 600; color: #3b82f6; text-decoration: underline;">18 <i class="ph ph-arrow-square-out" style="font-size: 16px;"></i></a>
                    </div>
                    <div id="btnRegDeviceExpand" style="display: none;">
                        <button class="btn btn-primary" onclick="openDetailedContentDrawer(event, 'reg_device')" style="background-color: #6366f1; border: none; border-radius: 16px; padding: 4px 12px; font-size: 13px;">展開中 &gt;</button>
                    </div>
                    <div id="hintRegDeviceExpand" style="font-size: 13px; color: #94a3b8; display: block;">點擊展開右側明細</div>
                </div>
            </div>\`;
        }`;

code = code.replace(regexOldReg, newReg);

fs.writeFileSync('script.js', code, 'utf8');
