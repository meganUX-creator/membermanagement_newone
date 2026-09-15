import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Clean up duplicate toggle window states from previous patch
content = re.sub(r'window\.activeDateMode = \'date\';[\s\S]*?if \(window\.renderTable\) window\.renderTable\(\);\n\};\n+', '', content)

setup_code = """
window.activeDateMode = 'date';
window.activeYebMode = 'balanceBuy';
window.activeDepositMode = 'deposit';
window.activeWithdrawMode = 'withdraw';
window.activeAdminMode = 'adminAdd';

window.toggleDropdownMode = function(mode, stateVar, e) {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    window[stateVar] = mode;
    if (window.renderTable) window.renderTable();
};
"""

content = content.replace('document.addEventListener(\'DOMContentLoaded\', () => {', 'document.addEventListener(\'DOMContentLoaded\', () => {\n' + setup_code, 1)


# Function to generate dropdown template
def make_dropdown(col_id, state_var, options, icon="ph-list"):
    options_html = ""
    for opt_val, opt_label in options:
        options_html += f"""<option value="{opt_val}" ${{window.{state_var} === '{opt_val}' ? 'selected' : ''}}>{opt_label}</option>"""
        
    return f"""label: () => `
    <div style="position: relative; display: inline-flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 8px 4px 30px; background: transparent; font-size: 13px; font-weight: 500; color: #475569; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'" onclick="event.stopPropagation()">
        <i class="ph {icon}" style="position: absolute; left: 8px; font-size: 16px;"></i>
        <select onchange="window.toggleDropdownMode(this.value, '{state_var}', event)" style="appearance: none; -webkit-appearance: none; border: none; background: transparent; outline: none; font-size: 13px; font-family: inherit; color: inherit; padding-right: 18px; cursor: pointer; font-weight: 500;">
            {options_html}
        </select>
        <i class="ph ph-caret-down" style="position: absolute; right: 8px; font-size: 12px; pointer-events: none;"></i>
    </div>
  `"""

# 2. Update dateInfo to include offlineDays
date_old = r"\{ id: 'dateInfo', group: '日期信息', \s*label: \(\) => `[\s\S]*?</span>`\s*\}\s*\}\s*\}\s*\}," # This regex is too messy, let's do manual replacement.

# To avoid regex hell, I'll extract the compactColumnsConfig array block and string replace inside it.
# Find start of compactColumnsConfig
start_idx = content.find("let compactColumnsConfig = [")
end_idx = content.find("];\n    const removedCompactCols")

if start_idx == -1 or end_idx == -1:
    print("compactColumnsConfig not found!")
    exit(1)

columns_block = content[start_idx:end_idx]

# Replace dateInfo entirely
date_info_start = columns_block.find("{ id: 'dateInfo',")
date_info_end = columns_block.find("{ id: 'offlineDays',")
if date_info_start != -1 and date_info_end != -1:
    columns_block = columns_block[:date_info_start] + columns_block[date_info_end:]

# Replace offlineDays with combined dateInfo
new_date_info = f"""{{ id: 'dateInfo', group: '日期信息', 
  {make_dropdown('dateInfo', 'activeDateMode', [('date', '新增時間'), ('lastLogin', '最後登入'), ('offlineDays', '離開天數')], 'ph-clock')}, 
  sortable: true, checkboxIndex: 9, 
  render: (user) => {{
    let val = '-';
    if (window.activeDateMode === 'lastLogin') val = user.lastLogin;
    else if (window.activeDateMode === 'offlineDays') val = user.offlineDays;
    else val = user.date;
    return `<td class="cell-val" data-col="dateInfo" style="font-family: monospace;">${{val}}</td>`;
  }} 
}},"""
columns_block = re.sub(r"\{\s*id:\s*'offlineDays'[\s\S]*?\},", new_date_info, columns_block)

# Replace yebInfo (balanceBuy + interest)
new_yeb_info = f"""{{ id: 'yebInfo', group: '信用 & 额度', 
  {make_dropdown('yebInfo', 'activeYebMode', [('balanceBuy', '餘額寶'), ('interest', '餘額寶利息')], 'ph-wallet')}, 
  sortable: true, checkboxIndex: 5, 
  render: (user) => {{
    let val = window.activeYebMode === 'interest' ? user.interest : (user.balanceBuy > 0 ? user.balanceBuy : '0');
    let highlight = (window.activeYebMode === 'balanceBuy' && user.balanceBuy > 0) ? 'highlight' : '';
    return `<td class="cell-money ${{highlight}}" data-col="yebInfo">${{val}}</td>`;
  }} 
}},"""
columns_block = re.sub(r"\{\s*id:\s*'balanceBuy'[\s\S]*?\},", new_yeb_info, columns_block)
columns_block = re.sub(r"\{\s*id:\s*'interest'[\s\S]*?\},", "", columns_block)

# Replace depositInfo (deposit + depositCount)
new_deposit_info = f"""{{ id: 'depositInfo', group: '存取款', 
  {make_dropdown('depositInfo', 'activeDepositMode', [('deposit', '存款總額'), ('depositCount', '存款次數')], 'ph-piggy-bank')}, 
  sortable: true, checkboxIndex: 6, 
  render: (user) => {{
    if (window.activeDepositMode === 'depositCount') return `<td class="cell-val" data-col="depositInfo">${{user.depositCount}}</td>`;
    let highlight = user.deposit > 0 ? 'highlight' : '';
    let val = user.deposit > 0 ? user.deposit : '0';
    return `<td class="cell-money ${{highlight}}" data-col="depositInfo">${{val}}</td>`;
  }} 
}},"""
columns_block = re.sub(r"\{\s*id:\s*'deposit'[\s\S]*?\},", new_deposit_info, columns_block)
columns_block = re.sub(r"\{\s*id:\s*'depositCount'[\s\S]*?\},", "", columns_block)

# Replace withdrawInfo (withdraw + withdrawCount + withdrawPre)
new_withdraw_info = f"""{{ id: 'withdrawInfo', group: '存取款', 
  {make_dropdown('withdrawInfo', 'activeWithdrawMode', [('withdraw', '取款總額'), ('withdrawCount', '取款次數'), ('withdrawPre', '提款扣金額')], 'ph-hand-coins')}, 
  sortable: true, checkboxIndex: 6, 
  render: (user) => {{
    if (window.activeWithdrawMode === 'withdrawCount') return `<td class="cell-val" data-col="withdrawInfo">${{user.withdrawCount}}</td>`;
    if (window.activeWithdrawMode === 'withdrawPre') return `<td class="cell-val" data-col="withdrawInfo">${{renderDataState(user.withdrawPre)}}</td>`;
    let val = user.withdraw > 0 ? user.withdraw : '0';
    return `<td class="cell-money" data-col="withdrawInfo">${{val}}</td>`;
  }} 
}},"""
columns_block = re.sub(r"\{\s*id:\s*'withdraw'[\s\S]*?\},", new_withdraw_info, columns_block)
columns_block = re.sub(r"\{\s*id:\s*'withdrawCount'[\s\S]*?\},", "", columns_block)
columns_block = re.sub(r"\{\s*id:\s*'withdrawPre'[\s\S]*?\},", "", columns_block)

# Replace adminFundInfo (adminAdd + adminDeduct)
new_admin_info = f"""{{ id: 'adminFundInfo', group: '存取款', 
  {make_dropdown('adminFundInfo', 'activeAdminMode', [('adminAdd', '後台加款總額'), ('adminDeduct', '後台扣款總額')], 'ph-buildings')}, 
  sortable: true, checkboxIndex: 6, 
  render: (user) => {{
    let val = window.activeAdminMode === 'adminDeduct' ? user.adminDeduct : user.adminAdd;
    return `<td class="cell-val" data-col="adminFundInfo">${{renderDataState(val)}}</td>`;
  }} 
}},"""
columns_block = re.sub(r"\{\s*id:\s*'adminAdd'[\s\S]*?\},", new_admin_info, columns_block)
columns_block = re.sub(r"\{\s*id:\s*'adminDeduct'[\s\S]*?\},", "", columns_block)

content = content[:start_idx] + columns_block + content[end_idx:]

# 3. Update Sorting logic
sort_logic_replacement = """
                let valA = a[currentSortColumn];
                let valB = b[currentSortColumn];
                
                if (currentSortColumn === 'dateInfo') {
                    valA = window.activeDateMode === 'lastLogin' ? a.lastLogin : (window.activeDateMode === 'offlineDays' ? a.offlineDays : a.date);
                    valB = window.activeDateMode === 'lastLogin' ? b.lastLogin : (window.activeDateMode === 'offlineDays' ? b.offlineDays : b.date);
                } else if (currentSortColumn === 'yebInfo') {
                    valA = window.activeYebMode === 'interest' ? a.interest : a.balanceBuy;
                    valB = window.activeYebMode === 'interest' ? b.interest : b.balanceBuy;
                } else if (currentSortColumn === 'depositInfo') {
                    valA = window.activeDepositMode === 'depositCount' ? a.depositCount : a.deposit;
                    valB = window.activeDepositMode === 'depositCount' ? b.depositCount : b.deposit;
                } else if (currentSortColumn === 'withdrawInfo') {
                    valA = window.activeWithdrawMode === 'withdrawCount' ? a.withdrawCount : (window.activeWithdrawMode === 'withdrawPre' ? a.withdrawPre : a.withdraw);
                    valB = window.activeWithdrawMode === 'withdrawCount' ? b.withdrawCount : (window.activeWithdrawMode === 'withdrawPre' ? b.withdrawPre : b.withdraw);
                } else if (currentSortColumn === 'adminFundInfo') {
                    valA = window.activeAdminMode === 'adminDeduct' ? a.adminDeduct : a.adminAdd;
                    valB = window.activeAdminMode === 'adminDeduct' ? b.adminDeduct : b.adminAdd;
                }
"""

content = re.sub(r"let valA = a\[currentSortColumn\];[\s\S]*?valB = window.activeDateMode === 'lastLogin' \? b\.lastLogin : b\.date;\n\s*\}", sort_logic_replacement.strip(), content)


# 4. Handle col.name mapping for custom column picker UI
label_picker_replacement = """
    // Name mapping for custom dropdowns
    const customNames = {
        'dateInfo': '新增時間 / 登入 / 離開天數',
        'yebInfo': '餘額寶 / 利息',
        'depositInfo': '存款總額 / 次數',
        'withdrawInfo': '取款總額 / 次數 / 扣款',
        'adminFundInfo': '後台加扣款'
    };
    const colName = customNames[col.id] || col.label;
    
    // Checkbox HTML
"""

content = re.sub(r"// Checkbox HTML", label_picker_replacement.strip() + "\n    // Checkbox HTML", content)

content = re.sub(r"\$\{typeof col\.label === 'function' \? '新增時間 \/ 最後登入' : col\.label\}", "${colName}", content)
content = re.sub(r"\$\{typeof col\.label === 'function' \? '新增時間 \/ 最後登入' : col\.label\}", "${colName}", content)

with open('script.js', 'w') as f:
    f.write(content)

print("Columns unified successfully!")
