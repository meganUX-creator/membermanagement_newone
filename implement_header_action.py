import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Replace getSortBtn with getActionMenuHtml
old_sort_btn = r"""        // Helper for Sort Icons
        function getSortBtn\(col\) \{
            const isActive = currentSortColumn === col;
            const isAsc = isActive && currentSortDirection === 'asc';
            const isDesc = isActive && currentSortDirection === 'desc';
            return `<button type="button" class="sort-btn \$\{isAsc \? 'active-asc' : ''\} \$\{isDesc \? 'active-desc' : ''\}" data-sort="\$\{col\}">
                <i class="ph-fill ph-caret-\$\{isDesc \? 'down' : 'up'\}"></i>
            </button>`;
        \}"""

new_action_menu = """        // Helper for Header Action Menu
        function getActionMenuHtml(col, isPinned) {
            const isActive = currentSortColumn === col.id;
            const isAsc = isActive && currentSortDirection === 'asc';
            const isDesc = isActive && currentSortDirection === 'desc';
            
            let menuContent = '';
            if (col.sortable) {
                menuContent += `
                    <i class="ph ph-sort-ascending sort-btn-asc" data-sort="${col.id}" title="遞增" style="padding: 4px; cursor: pointer; border-radius: 4px; ${isAsc ? 'color: #3b82f6;' : 'color: #64748b;'}"></i>
                    <i class="ph ph-sort-descending sort-btn-desc" data-sort="${col.id}" title="遞減" style="padding: 4px; cursor: pointer; border-radius: 4px; ${isDesc ? 'color: #3b82f6;' : 'color: #64748b;'}"></i>
                `;
            }
            menuContent += `
                <i class="ph ph-push-pin icon-pin" data-id="${col.id}" title="${isPinned ? '取消固定' : '固定'}" style="padding: 4px; cursor: pointer; border-radius: 4px; ${isPinned ? 'color: #3b82f6;' : 'color: #64748b;'}"></i>
            `;
            
            return `
                <div class="header-action-container" style="position: relative; display: inline-flex; align-items: center; margin-left: 8px;">
                    <i class="ph ph-dots-three-vertical" style="color: #94a3b8; cursor: pointer; padding: 2px 4px; border-radius: 4px;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='transparent'"></i>
                    <div class="header-action-menu" style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); z-index: 50; flex-direction: row; gap: 4px; white-space: nowrap;">
                        ${menuContent}
                    </div>
                </div>
            `;
        }"""

content = re.sub(old_sort_btn, new_action_menu, content)

# 2. Update pinned headers HTML
old_pinned = r"""<div style="display:flex;align-items:center;white-space:nowrap;justify-content:space-between;">
                            <div style="display:flex;align-items:center;">
                                <span>\$\{typeof col.label === 'function' \? col.label\(\) : col.label\}</span>
                                \$\{col.sortable \? getSortBtn\(col.id\) : ''\}
                            </div>
                            <i class="ph ph-push-pin icon-pin active" data-id="\$\{col.id\}" title="取消钉选"></i>
                        </div>"""

new_pinned = r"""<div style="display:flex;align-items:center;white-space:nowrap;justify-content:space-between;">
                            <div style="display:flex;align-items:center;">
                                <span>${typeof col.label === 'function' ? col.label() : col.label}</span>
                            </div>
                            ${getActionMenuHtml(col, true)}
                        </div>"""
content = re.sub(old_pinned, new_pinned, content)

# 3. Update unpinned headers HTML
old_unpinned = r"""<div style="display:flex;align-items:center;white-space:nowrap;justify-content:space-between;">
                            <div style="display:flex;align-items:center;">
                                <span>\$\{typeof col.label === 'function' \? col.label\(\) : col.label\}</span>
                                \$\{col.sortable \? getSortBtn\(col.id\) : ''\}
                            </div>
                            <i class="ph ph-push-pin icon-pin" data-id="\$\{col.id\}" title="钉选栏位"></i>
                        </div>"""

new_unpinned = r"""<div style="display:flex;align-items:center;white-space:nowrap;justify-content:space-between;">
                            <div style="display:flex;align-items:center;">
                                <span>${typeof col.label === 'function' ? col.label() : col.label}</span>
                            </div>
                            ${getActionMenuHtml(col, false)}
                        </div>"""
content = re.sub(old_unpinned, new_unpinned, content)

# 4. Replace sort event bindings
old_sort_events = r"""            userTableHeader.querySelectorAll\('\.sort-btn'\)\.forEach\(btn => \{
                btn\.addEventListener\('click', \(e\) => \{
                    e\.stopPropagation\(\);
                    const col = btn\.getAttribute\('data-sort'\);
                    if \(currentSortColumn === col\) \{
                        currentSortDirection = currentSortDirection === 'asc' \? 'desc' : 'asc';
                    \} else \{
                        currentSortColumn = col;
                        currentSortDirection = 'desc';
                    \}
                    renderTable\(\);
                \}\);
            \}\);"""

new_sort_events = r"""            userTableHeader.querySelectorAll('.sort-btn-asc').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const col = btn.getAttribute('data-sort');
                    currentSortColumn = col;
                    currentSortDirection = 'asc';
                    renderTable();
                });
            });
            userTableHeader.querySelectorAll('.sort-btn-desc').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const col = btn.getAttribute('data-sort');
                    currentSortColumn = col;
                    currentSortDirection = 'desc';
                    renderTable();
                });
            });"""

content = re.sub(old_sort_events, new_sort_events, content)

with open('script.js', 'w') as f:
    f.write(content)

print("HTML and Events patched.")
