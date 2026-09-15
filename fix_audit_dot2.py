import re

with open('script.js', 'r') as f:
    content = f.read()

old_logic = """<div onclick="if(window.openUserDetailsDrawer) { window.openUserDetailsDrawer('${user.uid}'); setTimeout(() => { const tab = document.querySelector('.user-details-tab-item[data-target=detailsAudit]'); if(tab) tab.click(); }, 50); }" style="display: flex; align-items: center; gap: 4px; color: #3b82f6; font-size: 12px; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='transparent'">
                                    會員審核 <i class="ph ph-arrow-right"></i>
                                </div>"""

new_logic = """<div onclick="if(window.openUserDetailsDrawer) { window.openUserDetailsDrawer('${user.uid}'); setTimeout(() => { const tab = document.querySelector('.user-details-tab-item[data-target=detailsAudit]'); if(tab) tab.click(); }, 50); }" style="position: relative; display: flex; align-items: center; gap: 4px; color: #3b82f6; font-size: 12px; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='transparent'">
                                    會員審核 
                                    ${(user.realNameAudited || user.birthdayAudited || user.phoneAudited || user.emailAudited || user.qqAudited || user.wechatAudited || user.zaloAudited) ? '<span style="width: 6px; height: 6px; background-color: #ef4444; border-radius: 50%; margin-left: 2px;"></span>' : ''}
                                    <i class="ph ph-arrow-right"></i>
                                </div>"""

content = content.replace(old_logic, new_logic)

with open('script.js', 'w') as f:
    f.write(content)

print("Red dot added to list mode expanded card.")
