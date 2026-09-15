import re

with open('script.js', 'r') as f:
    content = f.read()

# Replace the previous mode-segmented-control with the select dropdown
old_label = """  label: () => `
    <div class="mode-segmented-control" style="padding: 2px; border-radius: 6px; background-color: #f1f5f9; border: 1px solid #e2e8f0; display: inline-flex; position: relative; z-index: 20;" onclick="event.stopPropagation()">
        <button type="button" class="mode-btn" style="padding: 4px 8px; font-size: 12px; border-radius: 4px; ${window.activeDateMode === 'date' ? 'background: #3b82f6; color: white;' : 'color: #64748b; background: transparent; border: none;'}" onclick="window.toggleDateMode('date', event)">新增時間</button>
        <button type="button" class="mode-btn" style="padding: 4px 8px; font-size: 12px; border-radius: 4px; ${window.activeDateMode === 'lastLogin' ? 'background: #3b82f6; color: white;' : 'color: #64748b; background: transparent; border: none;'}" onclick="window.toggleDateMode('lastLogin', event)">最後登入</button>
    </div>
  `,"""

new_label = """  label: () => `
    <div style="position: relative; display: inline-flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 8px 4px 30px; background: transparent; font-size: 13px; font-weight: 500; color: #475569; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'" onclick="event.stopPropagation()">
        <i class="ph ph-clock" style="position: absolute; left: 8px; font-size: 16px;"></i>
        <select onchange="window.toggleDateMode(this.value, event)" style="appearance: none; -webkit-appearance: none; border: none; background: transparent; outline: none; font-size: 13px; font-family: inherit; color: inherit; padding-right: 18px; cursor: pointer; font-weight: 500;">
            <option value="date" ${window.activeDateMode === 'date' ? 'selected' : ''}>新增時間</option>
            <option value="lastLogin" ${window.activeDateMode === 'lastLogin' ? 'selected' : ''}>最後登入</option>
        </select>
        <i class="ph ph-caret-down" style="position: absolute; right: 8px; font-size: 12px; pointer-events: none;"></i>
    </div>
  `,"""

if old_label in content:
    content = content.replace(old_label, new_label)
else:
    print("Could not find the exact label to replace!")

with open('script.js', 'w') as f:
    f.write(content)

print("Dropdown patched successfully!")
