import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Update getPhoneStatusHtml to use 36 instead of 20
content = content.replace('if (window.hasPerm && window.hasPerm(20)) {', 'if (window.hasPerm && window.hasPerm(36)) {')

# 2. Update nestedRowHtml to use getPhoneStatusHtml for phone
old_nested_phone = """<div style="color: #475569; font-family: monospace;">${(user.phone && user.phone !== '-' && user.phone !== '未验证' && user.phone !== '末绑定' && user.phone !== '未绑定' && user.phone !== '待重新绑定' && user.phone !== '审核中') ? user.phone : '-'}</div>"""
new_nested_phone = """<div>${getPhoneStatusHtml(user.phone)}</div>"""
content = content.replace(old_nested_phone, new_nested_phone)

with open('script.js', 'w') as f:
    f.write(content)

print("Phone permission updated to 36.")
