import re

with open('script.js', 'r') as f:
    content = f.read()

old_logic = """    window.getPhoneStatusHtml = function(phone) {
        if (phone && phone !== '-' && phone !== '未验证' && phone !== '末绑定' && phone !== '未绑定') {
            return '<span style="color: #16a34a; font-weight: 500;">已验证</span>';
        }
        return '<span style="color: #94a3b8;">未验证</span>';
    }"""

new_logic = """    window.getPhoneStatusHtml = function(phone) {
        if (phone && phone !== '-' && phone !== '未验证' && phone !== '末绑定' && phone !== '未绑定' && phone !== '待重新绑定' && phone !== '审核中') {
            if (window.hasPerm && window.hasPerm(20)) {
                return `<span style="font-family: monospace; color: #475569;">${phone}</span>`;
            }
            return '<span style="color: #16a34a; font-weight: 500;">已验证</span>';
        }
        return '<span style="color: #94a3b8;">未验证</span>';
    }"""

content = content.replace(old_logic, new_logic)

with open('script.js', 'w') as f:
    f.write(content)

print("Phone logic updated.")
