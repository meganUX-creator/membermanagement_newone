import re

with open('script.js', 'r') as f:
    content = f.read()

# Add activeGrowthMode to setup_code
content = content.replace("window.activeAdminMode = 'adminAdd';", "window.activeAdminMode = 'adminAdd';\nwindow.activeGrowthMode = 'growth';")

# Remove `growth` column
content = re.sub(r"\s*\{\s*id:\s*'growth'[^}]*\},", "", content)

# Dropdown helper
def make_dropdown(col_id, state_var, options):
    options_html = ""
    for opt_val, opt_label in options:
        options_html += f"""<option value="{opt_val}" ${{window.{state_var} === '{opt_val}' ? 'selected' : ''}}>{opt_label}</option>"""
        
    return f"""label: () => `
    <div style="position: relative; display: inline-flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 8px 4px 10px; background: transparent; font-size: 13px; font-weight: 500; color: #475569; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'" onclick="event.stopPropagation()">
        <select onchange="window.toggleDropdownMode(this.value, '{state_var}', event)" style="appearance: none; -webkit-appearance: none; border: none; background: transparent; outline: none; font-size: 13px; font-family: inherit; color: inherit; padding-right: 18px; cursor: pointer; font-weight: 500;">
            {options_html}
        </select>
        <i class="ph ph-caret-down" style="position: absolute; right: 8px; font-size: 12px; pointer-events: none;"></i>
    </div>
  `"""

new_growth = f"""{{ id: 'growthInfo', group: '等级 & 团队', 
  {make_dropdown('growthInfo', 'activeGrowthMode', [('growth', '成長值'), ('vipGrowth', 'VIP成長值')])}, 
  sortable: true, checkboxIndex: 4, 
  render: (user) => {{
    let val = window.activeGrowthMode === 'vipGrowth' ? user.vipGrowth : user.growth;
    return `<td class="cell-val" data-col="growthInfo">${{val}}</td>`;
  }} 
}},"""

# Replace `vipGrowth` with `growthInfo`
content = re.sub(r"\{\s*id:\s*'vipGrowth'[^}]*\},", new_growth, content)

# Update sorting logic
sort_addition = """} else if (currentSortColumn === 'growthInfo') {
                    valA = window.activeGrowthMode === 'vipGrowth' ? a.vipGrowth : a.growth;
                    valB = window.activeGrowthMode === 'vipGrowth' ? b.vipGrowth : b.growth;
                """
content = content.replace("} else if (currentSortColumn === 'yebInfo')", sort_addition + "} else if (currentSortColumn === 'yebInfo')")

# Add to customNames
content = content.replace("'adminFundInfo': '後台加扣款'", "'adminFundInfo': '後台加扣款',\n                    'growthInfo': '成長值 / VIP成長值'")

with open('script.js', 'w') as f:
    f.write(content)

print("Growth dropdown added.")
