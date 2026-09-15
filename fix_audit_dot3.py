import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Update nested mode (line 2591 roughly)
# Notice that hasPendingAudit is already calculated if we do this around where it's generated? 
# Wait, `hasPendingAudit` is not defined in the scope of nestedRowHtml unless I compute it or use it inline.
# I can just inline the check:
nested_old = 'shouldShowOp("查看详情") ? `<a href="#" class="op-link user-detail-link" data-uid="${user.uid}">查看详情</a>` : \'\','
nested_new = 'shouldShowOp("查看详情") ? `<a href="#" class="op-link user-detail-link" data-uid="${user.uid}" style="position:relative; display:inline-flex; align-items:center;">查看详情 ${(user.realNameAudited || user.birthdayAudited || user.phoneAudited || user.emailAudited || user.qqAudited || user.wechatAudited || user.zaloAudited) ? \'<span style="width: 6px; height: 6px; background-color: #ef4444; border-radius: 50%; margin-left: 2px;"></span>\' : \'\'}</a>` : \'\','

content = content.replace(nested_old, nested_new)

# 2. Update the compact action menu hover event
hover_old = """    document.addEventListener('mouseover', (e) => {
        const icon = e.target.closest('.compact-action-icon');
        if (icon) {
            const uid = icon.getAttribute('data-uid');
            if (globalActionMenu) {
                globalActionMenu.setAttribute('data-uid', uid);
            }
            showMenu(icon);"""

hover_new = """    document.addEventListener('mouseover', (e) => {
        const icon = e.target.closest('.compact-action-icon');
        if (icon) {
            const uid = icon.getAttribute('data-uid');
            if (globalActionMenu) {
                globalActionMenu.setAttribute('data-uid', uid);
                
                const user = mockUsers.find(u => u.uid === uid) || mockUsers[0];
                const hasPendingAudit = user.realNameAudited || user.birthdayAudited || user.phoneAudited || user.emailAudited || user.qqAudited || user.wechatAudited || user.zaloAudited;
                
                const links = globalActionMenu.querySelectorAll('a');
                links.forEach(link => {
                    if (link.textContent.trim().startsWith('查看详情')) {
                        if (hasPendingAudit) {
                            link.innerHTML = `查看详情 <span style="display:inline-block; width: 6px; height: 6px; background-color: #ef4444; border-radius: 50%; margin-left: 4px; vertical-align: middle;"></span>`;
                        } else {
                            link.innerHTML = `查看详情`;
                        }
                    }
                });
            }
            showMenu(icon);"""

content = content.replace(hover_old, hover_new)

with open('script.js', 'w') as f:
    f.write(content)

print("Red dot added to '查看详情' buttons.")
