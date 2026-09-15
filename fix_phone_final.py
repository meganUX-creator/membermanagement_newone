import re

with open('script.js', 'r') as f:
    content = f.read()

old_func = """    window.getPhoneStatusHtml = function(phone) {
        if (phone && phone !== '-' && phone !== '未验证' && phone !== '末绑定' && phone !== '未绑定' && phone !== '待重新绑定' && phone !== '审核中') {
            if (window.hasPerm && window.hasPerm(36)) {
                return `<span style="font-family: monospace; color: #475569;">${phone}</span>`;
            }
            return '<span style="color: #16a34a; font-weight: 500;">已验证</span>';
        }
        return '<span style="color: #94a3b8;">未验证</span>';
    }"""
new_func = """    window.getPhoneStatusHtml = function(phone, forceStatusOnly = false) {
        if (phone && phone !== '-' && phone !== '未验证' && phone !== '末绑定' && phone !== '未绑定' && phone !== '待重新绑定' && phone !== '审核中') {
            if (!forceStatusOnly && window.hasPerm && window.hasPerm(36)) {
                return `<span style="font-family: monospace; color: #475569;">${phone}</span>`;
            }
            return '<span style="color: #16a34a; font-weight: 500;">已绑定</span>';
        }
        return '<span style="color: #94a3b8;">未绑定</span>';
    }"""
content = content.replace(old_func, new_func)


old_status = """        { id: 'status', group: '状态', label: '状态', checkboxIndex: 1, render: (user) => `<td data-col="status"><span class="user-custom-tag ${user.status === '正常' ? 'tag-green' : user.status === '冻结' ? 'tag-blue' : 'tag-red'}">${user.status}</span></td>` },"""
new_status = old_status + """\n        { id: 'phone', group: '状态', label: '手机号', checkboxIndex: 1, render: (user) => `<td class="cell-val" data-col="phone">${getPhoneStatusHtml(user.phone, true)}</td>` },"""
content = content.replace(old_status, new_status)


old_phone = """        { id: 'phone', group: '会员信息（详细）', label: '手机号', checkboxIndex: 3, render: (user) => `<td class="cell-val" data-col="phone">${getPhoneStatusHtml(user.phone)}</td>` },\n"""
content = content.replace(old_phone, '')


old_removed = """    const removedCompactCols = ['avatar', 'realName', 'phone', 'accountType', 'ip', 'userType', 'level', 'payLevel', 'registerMode', 'agentId', 'inviter', 'inviteCode', 'directTeam', 'tags', 'remark', 'followRemark'];"""
new_removed = """    const removedCompactCols = ['avatar', 'realName', 'accountType', 'ip', 'userType', 'level', 'payLevel', 'registerMode', 'agentId', 'inviter', 'inviteCode', 'directTeam', 'tags', 'remark', 'followRemark'];"""
content = content.replace(old_removed, new_removed)

with open('script.js', 'w') as f:
    f.write(content)

print("Phone column added back and texts changed.")
