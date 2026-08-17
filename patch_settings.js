const fs = require('fs');
let html = fs.readFileSync('content.html', 'utf8');

let newSettingsTab = `
            <!-- Tab 2: 會員設置 (Member Settings) -->
            <div class="tab-content-panel" id="tabContentSettings" style="display: none;">
                <div class="member-settings-container" style="display: flex; flex-direction: column;">
                    
                    <!-- Card 1: 費率與備註 -->
                    <div class="edit-card">
                        <div class="edit-card-header" style="margin-bottom: 16px;">
                            <div class="edit-card-title-wrap">
                                <div class="icon-container indigo" style="background-color: #f5f3ff; color: #7c3aed;"><i class="ph ph-currency-dollar"></i></div>
                                <h4 class="edit-card-title">費率與備註</h4>
                            </div>
                        </div>
                        <div class="edit-form-group" style="margin-bottom: 16px;">
                            <label style="display: flex; align-items: center; gap: 4px;">提現費率 <i class="ph ph-question" style="color: #94a3b8; font-size: 14px;"></i></label>
                            <input type="text" id="settingWithdrawFee" class="form-input" placeholder="例如：0.015（支持三位小數）">
                        </div>
                        <div class="edit-form-group">
                            <label>備註</label>
                            <textarea id="editFormRemark" class="form-textarea" rows="3" style="width: 100%; border-radius: 8px; border: 1px solid #cbd5e1; padding: 12px; font-size: 14px; outline: none; resize: vertical;" placeholder="大戶需關注"></textarea>
                        </div>
                    </div>

                    <!-- Card 2: 權限與限制 -->
                    <div class="edit-card">
                        <div class="edit-card-header" style="margin-bottom: 16px;">
                            <div class="edit-card-title-wrap">
                                <div class="icon-container indigo" style="background-color: #f5f3ff; color: #7c3aed;"><i class="ph ph-lock-key"></i></div>
                                <h4 class="edit-card-title">權限與限制</h4>
                            </div>
                            <span class="edit-card-subtitle">開啟即代表啟用該限制 / 功能</span>
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <!-- Item 1 -->
                            <div class="setting-switch-item">
                                <div class="setting-switch-content">
                                    <div class="setting-switch-title">停止第三方返水</div>
                                    <div class="setting-switch-desc">開啟後，該用戶將不再享有第三方返水優惠</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="settingStopThirdRebate">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <!-- Item 2 -->
                            <div class="setting-switch-item">
                                <div class="setting-switch-content">
                                    <div class="setting-switch-title">限制轉入第三方</div>
                                    <div class="setting-switch-desc">開啟後，該用戶帳戶無法轉帳至第三方平台</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="settingLimitThirdTransfer">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <!-- Item 3 -->
                            <div class="setting-switch-item">
                                <div class="setting-switch-content">
                                    <div class="setting-switch-title">停止彩票返水</div>
                                    <div class="setting-switch-desc">開啟後，該用戶的彩票投注將不再計算返水</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="settingStopLotteryRebate">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <!-- Item 4 -->
                            <div class="setting-switch-item">
                                <div class="setting-switch-content">
                                    <div class="setting-switch-title">邀請碼註冊 <i class="ph ph-question" style="color: #94a3b8; font-size: 14px;"></i></div>
                                    <div class="setting-switch-desc">此用戶為透過邀請碼完成註冊</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="settingInviteReg" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <!-- Item 5 -->
                            <div class="setting-switch-item">
                                <div class="setting-switch-content">
                                    <div class="setting-switch-title">停止成長值和等級更新</div>
                                    <div class="setting-switch-desc">開啟後，該用戶的成長值與會員等級將被凍結</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="settingStopLevelUpdate">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <!-- Item 6 -->
                            <div class="setting-switch-item">
                                <div class="setting-switch-content">
                                    <div class="setting-switch-title">能否修改下級賠率</div>
                                    <div class="setting-switch-desc">開啟後，該代理可自行調整下級會員的賠率設定</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="settingCanEditSubOdds">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Card 3: 每日次數限制 -->
                    <div class="edit-card">
                        <div class="edit-card-header" style="margin-bottom: 16px;">
                            <div class="edit-card-title-wrap">
                                <div class="icon-container indigo" style="background-color: #f5f3ff; color: #7c3aed;"><i class="ph ph-chart-bar"></i></div>
                                <h4 class="edit-card-title">每日次數限制</h4>
                            </div>
                        </div>
                        <div class="edit-form-grid">
                            <div class="edit-form-group">
                                <label>當天最大提款次數</label>
                                <input type="text" id="settingMaxWithdraw" class="form-input" placeholder="未設置即不限制">
                                <span style="font-size: 12px; color: #94a3b8; margin-top: 4px;">留空代表不限制提款次數</span>
                            </div>
                            <div class="edit-form-group">
                                <label>當天最大充值返利次數</label>
                                <input type="text" id="settingMaxRebate" class="form-input" placeholder="未設置即不限制">
                                <span style="font-size: 12px; color: #94a3b8; margin-top: 4px;">留空代表不限制充值返利次數</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
`;

let tabStart = html.indexOf('<!-- Tab 2: 會員設置');
let tabEnd = html.indexOf('</div>\n            </div>\n        </div>\n        </main>');
if (tabEnd === -1) {
    tabEnd = html.indexOf('</div>\n        </div>\n        </main>');
}

let finalHtml = html.substring(0, tabStart) + newSettingsTab + html.substring(tabEnd);
fs.writeFileSync('content.html', finalHtml);
console.log('Settings Tab Restructured successfully');
