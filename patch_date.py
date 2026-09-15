import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Add window.activeDateMode and window.toggleDateMode at the top of script.js
setup_code = """
window.activeDateMode = 'date';
window.toggleDateMode = function(mode, e) {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    window.activeDateMode = mode;
    if (window.renderTable) window.renderTable();
};
"""
if "window.activeDateMode =" not in content:
    content = content.replace('document.addEventListener(\'DOMContentLoaded\', () => {', 'document.addEventListener(\'DOMContentLoaded\', () => {\n' + setup_code)

# 2. Replace { id: 'date' ... } and { id: 'lastLogin' ... } with { id: 'dateInfo' ... }
date_pattern = r"\{\s*id:\s*'date',\s*group:\s*'日期信息',\s*label:\s*'新增时间',\s*sortable:\s*true,\s*checkboxIndex:\s*9,\s*render:\s*\(user\)\s*=>\s*`<td class=\"cell-val\" data-col=\"date\">\$\{user\.date\}</td>`\s*\},\s*\{\s*id:\s*'lastLogin',\s*group:\s*'日期信息',\s*label:\s*'最后登录',\s*sortable:\s*true,\s*checkboxIndex:\s*9,\s*render:\s*\(user\)\s*=>\s*`<td class=\"cell-val\" data-col=\"lastLogin\">\$\{user\.lastLogin\}</td>`\s*\},"

new_col = """{ id: 'dateInfo', group: '日期信息', 
  label: () => `
    <div class="mode-segmented-control" style="padding: 2px; border-radius: 6px; background-color: #f1f5f9; border: 1px solid #e2e8f0; display: inline-flex; position: relative; z-index: 20;" onclick="event.stopPropagation()">
        <button type="button" class="mode-btn" style="padding: 4px 8px; font-size: 12px; border-radius: 4px; ${window.activeDateMode === 'date' ? 'background: #3b82f6; color: white;' : 'color: #64748b; background: transparent; border: none;'}" onclick="window.toggleDateMode('date', event)">新增時間</button>
        <button type="button" class="mode-btn" style="padding: 4px 8px; font-size: 12px; border-radius: 4px; ${window.activeDateMode === 'lastLogin' ? 'background: #3b82f6; color: white;' : 'color: #64748b; background: transparent; border: none;'}" onclick="window.toggleDateMode('lastLogin', event)">最後登入</button>
    </div>
  `, 
  sortable: true, checkboxIndex: 9, 
  render: (user) => {
    const val = window.activeDateMode === 'lastLogin' ? user.lastLogin : user.date;
    return `<td class="cell-val" data-col="dateInfo" style="font-family: monospace;">${val}</td>`;
  } 
},"""

content = re.sub(date_pattern, new_col, content)

# 3. Update header rendering to support label as function
content = content.replace("<span>${col.label}</span>", "<span>${typeof col.label === 'function' ? col.label() : col.label}</span>")

# 4. Update the sorting logic to handle 'dateInfo'
sort_logic_replacement = """
                let valA = a[currentSortColumn];
                let valB = b[currentSortColumn];
                
                if (currentSortColumn === 'dateInfo') {
                    valA = window.activeDateMode === 'lastLogin' ? a.lastLogin : a.date;
                    valB = window.activeDateMode === 'lastLogin' ? b.lastLogin : b.date;
                }
"""
content = content.replace("let valA = a[currentSortColumn];\n                let valB = b[currentSortColumn];", sort_logic_replacement)

with open('script.js', 'w') as f:
    f.write(content)

print("Patched successfully!")
