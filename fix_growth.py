import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Remove the growth line exactly
growth_line = "        { id: 'growth', group: '等级 & 团队', label: '成长值', sortable: true, checkboxIndex: 4, render: (user) => `<td class=\"cell-val\" data-col=\"growth\">${user.growth}</td>` },"
content = content.replace(growth_line + '\n', "")

# 2. Dropdown helper
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

# 3. Replace vipGrowth exactly
vip_growth_line = "        { id: 'vipGrowth', group: '等级 & 团队', label: 'VIP成长值', sortable: true, checkboxIndex: 4, render: (user) => `<td class=\"cell-val\" data-col=\"vipGrowth\">${user.vipGrowth}</td>` },"
content = content.replace(vip_growth_line, new_growth)

with open('script.js', 'w') as f:
    f.write(content)

print("Fixed growth regex.")
