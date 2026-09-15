import re

with open('script.js', 'r') as f:
    content = f.read()

old_logic = """        const detailsAuditTabBtn = document.getElementById('detailsAuditTabBtn');
        if (detailsAuditTabBtn) {
            detailsAuditTabBtn.style.display = hasPerm(27) ? '' : 'none';
        }
        
        const user = mockUsers.find(u => u.uid === uid) || mockUsers[0];"""

new_logic = """        const user = mockUsers.find(u => u.uid === uid) || mockUsers[0];
        
        const detailsAuditTabBtn = document.getElementById('detailsAuditTabBtn');
        if (detailsAuditTabBtn) {
            detailsAuditTabBtn.style.display = hasPerm(27) ? '' : 'none';
            const hasPendingAudit = user.realNameAudited || user.birthdayAudited || user.phoneAudited || user.emailAudited || user.qqAudited || user.wechatAudited || user.zaloAudited;
            
            let redDot = detailsAuditTabBtn.querySelector('.audit-red-dot');
            if (!redDot) {
                detailsAuditTabBtn.style.position = 'relative';
                redDot = document.createElement('span');
                redDot.className = 'audit-red-dot';
                redDot.style.cssText = 'position: absolute; top: 4px; right: 4px; width: 6px; height: 6px; background-color: #ef4444; border-radius: 50%;';
                detailsAuditTabBtn.appendChild(redDot);
            }
            redDot.style.display = hasPendingAudit ? '' : 'none';
        }"""

content = content.replace(old_logic, new_logic)

with open('script.js', 'w') as f:
    f.write(content)

print("Red dot logic added.")
