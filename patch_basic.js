const fs = require('fs');
let html = fs.readFileSync('content.html', 'utf8');

// The withdraw table section currently in content.html
let withdrawStart = html.indexOf('<div class="withdraw-info-section"');
let withdrawEnd = html.indexOf('</div>\n                </form>', withdrawStart);
let withdrawContent = html.substring(withdrawStart, withdrawEnd);

// Wrap withdraw table in card
let newWithdrawCard = `
                    <div class="edit-card">
                        <div class="edit-card-header" style="margin-bottom: 0;">
                            <div class="edit-card-title-wrap">
                                <div class="icon-container indigo"><i class="ph ph-credit-card"></i></div>
                                <h4 class="edit-card-title">提現信息</h4>
                            </div>
                            <button type="button" class="btn btn-primary btn-sm" style="background-color: #6366f1; border-color: #6366f1; border-radius: 8px; padding: 4px 16px;"><i class="ph ph-plus" style="margin-right: 4px;"></i>添加</button>
                        </div>
                        <!-- Re-using existing table structure with minor tweaks -->
                        ${withdrawContent.replace(/<div.*?justify-content: space-between.*?提現信息<\/h4>.*?<\/div>/s, '')}
                    </div>
`;

let newBasicTab = `
            <div class="tab-content-panel active" id="tabContentBasic">
                <form id="userEditForm" class="user-edit-form" style="display: flex; flex-direction: column;">
                    
                    <!-- Card 1: 帳戶概況 -->
                    <div class="edit-card">
                        <div class="edit-card-header">
                            <div class="edit-card-title-wrap">
                                <div class="icon-container indigo" style="background-color: #e0e7ff; color: #4f46e5;"><i class="ph ph-user"></i></div>
                                <h4 class="edit-card-title">帳戶概況</h4>
                            </div>
                            <span class="edit-card-subtitle">帳號 · 狀態 · 會員類型 · 等級</span>
                        </div>
                        <div class="edit-form-grid">itFormZalo" class="form-input"></div>
                            <div class="edit-form-group"><label>WhatsApp</label><input type="text" id="editFormWhatsapp" class="form-input"></div>
                            <div class="edit-form-group"><label>Telegram</label><input type="text" id="editFormTelegram" class="form-input"></div>
                            <div class="edit-form-group"><label>Facebook</label><input type="text" id="editFormFacebook" class="form-input"></div>
                        </div>
                    </div>

                    <!-- Card 3: 第三方登入綁定 -->
                    <div class="edit-card">
                        <div class="edit-card-header" style="margin-bottom: 16px;">
                            <div class="edit-card-title-wrap">
                                <div class="icon-container blue" style="background-color: #f8fafc; border: 1px solid #e2e8f0; color: #4f46e5;"><i class="ph ph-coffee"></i></div>
                                <h4 class="edit-card-title">第三方登入綁定</h4>
                            </div>
                        </div>
                        <div class="edit-form-grid">
                            <div class="edit-form-group">
                                <label>Facebook 登入</label>
                                <div style="height: 40px; border-radius: 8px; border: 1px dashed #cbd5e1; background-color: #f8fafc; color: #94a3b8; display: flex; align-items: center; justify-content: center; font-size: 14px;">尚未綁定</div>
                            </div>
                            <div class="edit-form-group">
                                <label>Google 登入</label>
                                <div style="height: 40px; border-radius: 8px; border: 1px dashed #cbd5e1; background-color: #f8fafc; color: #94a3b8; display: flex; align-items: center; justify-content: center; font-size: 14px;">尚未綁定</div>
                            </div>
                            <div class="edit-form-group">
                                <label>Telegram 登入</label>
                                <div style="height: 40px; border-radius: 8px; border: 1px dashed #cbd5e1; background-color: #f8fafc; color: #94a3b8; display: flex; align-items: center; justify-content: center; font-size: 14px;">尚未綁定</div>
                            </div>
                        </div>
                    </div>

                    <!-- Card 4: 提現信息 -->
                    ${newWithdrawCard}

                </form>
            </div>
`;

let tabStart = html.indexOf('<div class="tab-content-panel active" id="tabContentBasic">');
let tabEnd = html.indexOf('</form>\n            </div>', tabStart) + 26;

let finalHtml = html.substring(0, tabStart) + newBasicTab + html.substring(tabEnd);
fs.writeFileSync('content.html', finalHtml);
console.log('Basic Tab Restructured successfully');

                            <div class="edit-form-group" style="grid-column: 1 / -1;">
                                <label>帳號</label>
                                <input type="text" class="form-input" id="editFormAccountInput" value="test_user_1" disabled style="background-color: #f8fafc; border-style: dashed; color: #475569; font-weight: 500;">
                            </div>
                            <div class="edit-form-group">
                                <label>會員類型</label>
                                <div class="radio-pill-group">
                                    <label class="radio-pill"><input type="radio" name="editUserType" value="代理會員" checked><i class="ph ph-check-circle"></i><span>代理會員</span></label>
                                    <label class="radio-pill"><input type="radio" name="editUserType" value="普通會員"><i class="ph ph-circle"></i><span>普通會員</span></label>
                                </div>
                            </div>
                            <div class="edit-form-group">
                                <label>帳戶狀態</label>
                                <div class="radio-pill-group">
                                    <label class="radio-pill"><input type="radio" name="editStatus" value="正常" checked><i class="ph ph-check-circle"></i><span>正常</span></label>
                                    <label class="radio-pill color-red"><input type="radio" name="editStatus" value="冻结"><i class="ph ph-circle"></i><span>冻结</span></label>
                                    <label class="radio-pill color-red"><input type="radio" name="editStatus" value="停用"><i class="ph ph-circle"></i><span>停用</span></label>
                                </div>
                            </div>
                            <div class="edit-form-group"><label>用戶暱稱</label><input type="text" id="editFormNickname" class="form-input"></div>
                            <div class="edit-form-group"><label>真實姓名</label><input type="text" id="editFormRealName" class="form-input"></div>
                            <div class="edit-form-group"><label>出生年月日</label><input type="date" id="editFormBirthday" class="form-input"></div>
                            <div class="edit-form-group">
                                <label>用戶等級</label>
                                <select id="editFormLevel" class="form-select">
                                    <option value="普通會員">普通會員</option>
                                    <option value="黃金會員">黃金會員</option>
                                    <option value="VIP會員">VIP會員</option>!
                            </div>
                            <div class="edit-form-group"><label>國家</label><input type="text" id="editFormCountry" class="form-input" value="VN"></div>
                            <div class="edit-form-group"><label>幣種</label><input type="text" 
                        <div class="edit-card-header">
                            <div class="edit-card-title-wrap">
                                <div class="icon-container indigo" style="background-color: #f5f3ff; color: #7c3aed;"><i class="ph ph-phone"></i></div>
                                <h4 class="edit-card-title">聯絡方式</h4>
                            </div>
                            <span class="edit-card-subtitle">電話 · 郵箱 · 即時通訊</span>
                        </div>
                        <div class="edit-form-grid">
                            <div class="edit-form-group">
                                <label>電話</label>
                                <div style="display: flex; gap: 8px;">
                                    <input type="text" id="editFormPhone" class="form-input" style="flex: 1;" placeholder="0912345678">
                                    <button type="button" class="btn btn-primary" style="background-color: #6366f1; border-color: #6366f1; border-radius: 8px; padding: 0 16px;">校驗</button>
                                </div>
                            </div>
                            <div class="edit-form-group"><label>email</label><input type="text" id="editFormEmail" class="form-input"></div>
                            <div class="edit-form-group"><label>QQ</label><input type="text" id="editFormQQ" class="form-input"></div>
                            <div class="edit-form-group"><label>微信</label><input type="text" id="editFormWechat" class="form-input"></div>
                            <div class="edit-form-group"><label>Zalo</label><input type="text" id="edid="editFormCurrency" class="form-input" value="VND"></div>
                        </div>
                    </div>

                    <!-- Card 2: 聯絡方式 -->
                    <div class="edit-card">