import re

with open('/Users/user/Desktop/需求維護/usermanagement_new/0926_settings_new_lottery_4/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. ds_debt and ds_creditVal default to false
content = content.replace("let dataSourceFieldVisibility = { 'ds_debt': 'backup', 'ds_creditVal': 'backup' };", "let dataSourceFieldVisibility = { 'ds_debt': false, 'ds_creditVal': false };")

# 2. In createCol1Item, remove the "x" button logic entirely.
# Look for the section where actionButtons is built for col1.
# It used to have:
# actionButtons += `<button type="button" class="btn-action-icon" style="color:#ef4444;" title="隐藏 (移至备用)" onclick="window.hideTableColumn('${col.id}', '${type}')"><i class="ph ph-x"></i></button>`;
# The exact code currently:
'''
            if (!hasCardEquivalent) {
                actionButtons += `<button type="button" class="btn-action-icon" style="color:#8b5cf6;" title="移至卡片" onclick="window.demoteColumnToCard('${col.id}', '${type}')"><i class="ph ph-arrow-right"></i></button>`;
            }
            // Hide (Move to Backup)
            actionButtons += `<button type="button" class="btn-action-icon" style="color:#ef4444;" title="隐藏 (移至备用)" onclick="window.hideTableColumn('${col.id}', '${type}')"><i class="ph ph-x"></i></button>`;
'''
col1_x_pattern = r"// Hide \(Move to Backup\)\s*actionButtons \+= `<button type=\"button\" class=\"btn-action-icon\" style=\"color:#ef4444;\" title=\"隐藏 \(移至备用\)\" onclick=\"window\.hideTableColumn\('\$\\{col\.id\\}', '\$\\{type\\}'\)\"><i class=\"ph ph-x\"><\/i><\/button>`;"
content = re.sub(col1_x_pattern, "", content)

# 3. In createCol2Item, remove the "x" button logic entirely.
'''
                <div style="padding: 4px 8px; background: #f8fafc; display: flex; align-items: center; justify-content: center;">
                    <button type="button" class="btn-action-icon" style="color:#94a3b8; border: none; background: transparent; padding: 0; cursor: pointer; display: flex;" title="移除到备用" onclick="window.removeCardColumn('${col.id}')"><i class="ph ph-x" style="font-size: 13px; font-weight: bold;"></i></button>
                </div>
'''
col2_x_pattern = r"<div style=\"padding: 4px 8px; background: #f8fafc; display: flex; align-items: center; justify-content: center;\">\s*<button type=\"button\" class=\"btn-action-icon\" style=\"color:#94a3b8; border: none; background: transparent; padding: 0; cursor: pointer; display: flex;\" title=\"移除到备用\" onclick=\"window\.removeCardColumn\('\$\\{col\.id\\}'\)\"><i class=\"ph ph-x\" style=\"font-size: 13px; font-weight: bold;\"><\/i><\/button>\s*<\/div>"
content = re.sub(col2_x_pattern, "", content)

# 4. Remove `backupFields` entirely from renderDrawerStates.
# let backupFields = [];
content = content.replace("let backupFields = [];", "")

# if (dataSourceFieldVisibility[col.id] !== 'backup') {
#    cardFields.push(col);
# } else {
#    backupFields.push(col);
# }
# Replaced with just pushing to cardFields unconditionally
# wait, actually we check visibility:
content = re.sub(r"if \(dataSourceFieldVisibility\[col\.id\] !== 'backup'\) \{\s*cardFields\.push\(col\);\s*\} else \{\s*backupFields\.push\(col\);\s*\}", "cardFields.push(col);", content)

# 5. Remove `col3` manipulation.
# const col3 = document.getElementById('col3-backup-fields');
# if (col3) col3.innerHTML = '';
content = content.replace("const col3 = document.getElementById('col3-backup-fields');", "")
content = content.replace("if (col3) col3.innerHTML = '';", "")

# const badge3 = document.getElementById('badge-col3');
# if (badge3) badge3.textContent = backupFields.length;
content = content.replace("const badge3 = document.getElementById('badge-col3');", "")
content = content.replace("if (badge3) badge3.textContent = backupFields.length;", "")

# // 3. Render Backup Fields (Column 3)
# backupFields.forEach(col => {
#     col3.appendChild(createCol3Item(col));
# });
content = re.sub(r"// 3\. Render Backup Fields \(Column 3\)\s*backupFields\.forEach\(col => \{\s*col3\.appendChild\(createCol3Item\(col\)\);\s*\}\);", "", content)

with open('/Users/user/Desktop/需求維護/usermanagement_new/0926_settings_new_lottery_4/script.js', 'w', encoding='utf-8') as f:
    f.write(content)
