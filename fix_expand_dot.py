import re

with open('script.js', 'r') as f:
    content = f.read()

old_logic = """                let cellsHtml = `<td class="sticky-col sticky-col-1" style="left:0;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button class="btn-expand-row" style="background: none; border: none; cursor: pointer; color: #8c9bb3; display: flex; align-items: center; justify-content: center; padding: 2px;">
                            <i class="ph ph-caret-right" style="transition: transform 0.2s;"></i>
                        </button>
                        <input type="checkbox" class="user-checkbox">
                    </div>
                </td>`;"""

new_logic = """                const hasPendingAudit = user.realNameAudited || user.birthdayAudited || user.phoneAudited || user.emailAudited || user.qqAudited || user.wechatAudited || user.zaloAudited;
                
                let cellsHtml = `<td class="sticky-col sticky-col-1" style="left:0;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button class="btn-expand-row" style="position: relative; background: none; border: none; cursor: pointer; color: #8c9bb3; display: flex; align-items: center; justify-content: center; padding: 2px;">
                            <i class="ph ph-caret-right" style="transition: transform 0.2s;"></i>
                            ${hasPendingAudit ? '<span style="position: absolute; top: 2px; right: 0px; width: 6px; height: 6px; background-color: #ef4444; border-radius: 50%;"></span>' : ''}
                        </button>
                        <input type="checkbox" class="user-checkbox">
                    </div>
                </td>`;"""

content = content.replace(old_logic, new_logic)

with open('script.js', 'w') as f:
    f.write(content)

print("Red dot added to expand button.")
