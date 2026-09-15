import re

with open('script.js', 'r') as f:
    content = f.read()

old_func = """    window.getPhoneStatusHtml = function(phone, forceStatusOnly = false) {
        if (phone && phone !== '-' && phone !== '未验证' && phone !== '末绑定' && phone !== '未绑定' && phone !== '待重新绑定' && phone !== '审核中') {
            if (!forceStatusOnly && window.hasPerm && window.hasPerm(36)) {
                return `<span style="font-family: monospace; color: #475569;">${phone}</span>`;
            }
            return '<span style="color: #16a34a; font-weight: 500;">已绑定</span>';
        }
        return '<span style="color: #94a3b8;">未绑定</span>';
    }"""

new_func = """    window.getPhoneStatusHtml = function(phone, forceStatusOnly = false) {
        const isVerified = phone && phone !== '-' && phone !== '未验证' && phone !== '末绑定' && phone !== '未绑定' && phone !== '待重新绑定' && phone !== '审核中';
        
        if (forceStatusOnly || !(window.hasPerm && window.hasPerm(36))) {
            return isVerified ? '<span style="color: #16a34a; font-weight: 500;">已绑定</span>' : '<span style="color: #94a3b8;">未绑定</span>';
        }
        
        return isVerified ? `<span style="font-family: monospace; color: #475569;">${phone}</span>` : '<span style="color: #94a3b8;">-</span>';
    }"""

content = content.replace(old_func, new_func)

with open('script.js', 'w') as f:
    f.write(content)

print("Phone logic updated to show '-' when permitted and unverified.")
