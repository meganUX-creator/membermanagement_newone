import re

with open('script.js', 'r') as f:
    content = f.read()

start_marker = "// Render Detail Expanded Row"
end_marker = "<!-- Card 4: 標籤 -->"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit(1)

new_content = """// Render Detail Expanded Row
            const expandTr = document.createElement('tr');
            expandTr.className = 'member-expand-row';
            expandTr.style.display = 'none';
            expandTr.id = `expand-${user.uid}`;
            
            // Parse remark and followRemark
            const remarkHtml = renderDataState(user.remark, 'longText');
            const followRemarkHtml = renderDataState(user.followRemark, 'longText');
            
            expandTr.innerHTML = `
                <td colspan="100%" class="member-expand-cell" style="padding: 0; background: #f8fafc; position: sticky; left: 0; z-index: 5;">
                    <div class="member-expand-grid" style="padding: 24px 32px 24px 56px; background: #f8fafc; display: flex; flex-direction: row; overflow-x: auto; gap: 20px; border-bottom: 1px solid #e2e8f0; box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.02); box-sizing: border-box;">
                        
                        <!-- Card 1: 基本資料 -->
                        <div style="width: max-content; flex-shrink: 0; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); overflow: hidden;">
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
                                <div style="display: flex; align-items: center; gap: 8px; color: #3b82f6; font-size: 14px; font-weight: 600;">
                                    <i class="ph ph-user"></i> 基本資料
                                </div>
                                <div onclick="if(window.openUserDetailsDrawer) { window.openUserDetailsDrawer('${user.uid}'); setTimeout(() => { const tab = document.querySelector('.user-details-tab-item[data-target=detailsAudit]'); if(tab) tab.click(); }, 50); }" style="display: flex; align-items: center; gap: 4px; color: #3b82f6; font-size: 12px; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='transparent'">
                                    會員審核 <i class="ph ph-arrow-right"></i>
                                </div>
                            </div>
                            <div style="display: flex; padding: 0 16px;">
                                <!-- Column 1 -->
                                <div style="width: 250px; padding: 12px 16px 12px 0; border-right: 1px solid #f1f5f9;">
                                    <div style="display: flex; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; align-items: center;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">大頭照</div>
                                        <div style="width: 28px; height: 28px; border-radius: 50%; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;">
                                            ${user.account.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">真實姓名</div>
                                        <div style="color: #1e293b; font-weight: 500;">${renderDataState(user.realName)}</div>
                                    </div>
                                    <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">生日</div>
                                        <div style="color: #1e293b; font-weight: 500; font-family: monospace;">${user.birthday || '1995-08-18'}</div>
                                    </div>
                                    <div style="display: flex; padding-top: 12px; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">帳號類型</div>
                                        <div style="color: #1e293b; font-weight: 500;">${user.accountType || '普通帐号'}</div>
                                    </div>
                                </div>
                                <!-- Column 2 -->
                                <div style="width: 250px; padding: 12px 16px; ${hasPerm(20) ? 'border-right: 1px solid #f1f5f9;' : ''}">
                                    <div style="display: flex; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">會員類型</div>
                                        <div style="color: #1e293b; font-weight: 500;">${user.userType || '代理会员'}</div>
                                    </div>
                                    <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">等級</div>
                                        <div style="color: #1e293b; font-weight: 500;">${user.level}</div>
                                    </div>
                                    <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">支付層級</div>
                                        <div style="color: #1e293b; font-weight: 500;">${user.payLevel}</div>
                                    </div>
                                    <div style="display: flex; padding-top: 12px; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">註冊模式</div>
                                        <div style="color: #1e293b; font-weight: 500;">${user.registerMode || '一般注册'}</div>
                                    </div>
                                </div>
                                
                                ${hasPerm(20) ? `
                                <!-- Column 3 (Contact Info Left) -->
                                <div style="width: 250px; padding: 12px 16px; border-right: 1px solid #f1f5f9;">
                                    <div style="display: flex; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">電話</div>
                                        <div style="color: #475569; font-family: monospace;">${(user.phone && user.phone !== '-' && user.phone !== '未验证' && user.phone !== '末绑定' && user.phone !== '未绑定' && user.phone !== '待重新绑定' && user.phone !== '审核中') ? user.phone : '-'}</div>
                                    </div>
                                    <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">QQ</div>
                                        <div style="color: #475569; font-family: monospace;">88392019</div>
                                    </div>
                                    <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">Zalo</div>
                                        <div style="color: #475569; font-family: monospace;">+84${user.phone && user.phone.length > 2 ? user.phone.substring(2) : '定'}</div>
                                    </div>
                                    <div style="display: flex; padding-top: 12px; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">Telegram</div>
                                        <div style="color: #475569; font-family: monospace;">@${user.account}_tg</div>
                                    </div>
                                </div>
                                <!-- Column 4 (Contact Info Right) -->
                                <div style="width: 250px; padding: 12px 0 12px 16px;">
                                    <div style="display: flex; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">email</div>
                                        <div style="color: #475569;">${user.account}@example.com</div>
                                    </div>
                                    <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">微信</div>
                                        <div style="color: #475569; font-family: monospace;">wx_${user.account}</div>
                                    </div>
                                    <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">WhatsApp</div>
                                        <div style="color: #475569; font-family: monospace;">+84${user.phone && user.phone.length > 2 ? user.phone.substring(2) : '定'}</div>
                                    </div>
                                    <div style="display: flex; padding-top: 12px; font-size: 13px;">
                                        <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">Facebook</div>
                                        <div style="color: #475569;">fb.me/${user.account}</div>
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Card 2: 設備與ip -->
                        <div style="width: 280px; flex-shrink: 0; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); overflow: hidden;">
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
                                <div style="display: flex; align-items: center; gap: 8px; color: #3b82f6; font-size: 14px; font-weight: 600;">
                                    <i class="ph ph-desktop"></i> 設備與ip
                                </div>
                                <div onclick="if(window.openUserDetailsDrawer) { window.openUserDetailsDrawer('${user.uid}'); setTimeout(() => { const tab = document.querySelector('.user-details-tab-item[data-target=detailsLogin]'); if(tab) tab.click(); }, 50); }" style="display: flex; align-items: center; gap: 4px; color: #3b82f6; font-size: 12px; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='transparent'">
                                    設備詳情 <i class="ph ph-arrow-right"></i>
                                </div>
                            </div>
                            <div style="padding: 12px 16px;">
                                <div style="display: flex; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                    <div style="width: 90px; color: #8c9bb3; flex-shrink: 0;">註冊 IP</div>
                                    <div style="color: #1e293b; font-weight: 500; font-family: monospace;">
                                        192.168.1.1 <i class="ph ph-copy" style="color: #cbd5e1; cursor: pointer;"></i>
                                    </div>
                                </div>
                                <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                    <div style="width: 90px; color: #8c9bb3; flex-shrink: 0;">新增時間</div>
                                    <div style="color: #1e293b; font-weight: 500; font-family: monospace;">${user.date || '-'}</div>
                                </div>
                                <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                    <div style="width: 90px; color: #8c9bb3; flex-shrink: 0;">登入 IP</div>
                                    <div style="color: #1e293b; font-weight: 500; font-family: monospace;">
                                        ${user.ip || '54.150.111.152'} <i class="ph ph-copy" style="color: #cbd5e1; cursor: pointer;"></i>
                                    </div>
                                </div>
                                <div style="display: flex; padding-top: 12px; font-size: 13px;">
                                    <div style="width: 90px; color: #8c9bb3; flex-shrink: 0;">登入時間</div>
                                    <div style="color: #1e293b; font-weight: 500; font-family: monospace;">
                                        ${user.lastLogin || '2026-07-28 16:30:42'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card 3: 推薦關係 -->
                        <div style="width: 300px; flex-shrink: 0; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                            <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #3b82f6; font-size: 14px; font-weight: 600;">
                                <i class="ph ph-share-network"></i> 推薦關係
                            </div>
                            <div style="padding: 0 16px;">
                                <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                    <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">代理</div>
                                    <div style="color: #1e293b; font-weight: 500;">${renderDataState(user.agentId)}</div>
                                </div>
                                <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                    <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">邀請人</div>
                                    <div style="color: #1e293b; font-weight: 500;">${user.inviter || '-'}</div>
                                </div>
                                <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                                    <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">邀請碼</div>
                                    <div style="color: #1e293b; font-weight: 500;">${user.inviteCode || '-'}</div>
                                </div>
                                <div style="display: flex; padding: 12px 0; font-size: 13px;">
                                    <div style="width: 80px; color: #8c9bb3; flex-shrink: 0;">下級/團隊</div>
                                    <div style="color: #3b82f6; font-weight: 500;"><a href="#" class="subordinate-link" style="color: #3b82f6; text-decoration: none;" data-uid="${user.uid}">${user.directTeam}</a></div>
                                </div>
                            </div>
                        </div>

                        <!-- Card 4: 標籤 -->"""

final_content = content[:start_idx] + new_content + content[end_idx + len(end_marker):]

with open('script.js', 'w') as f:
    f.write(final_content)

print("Fixed!")
