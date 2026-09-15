import re

with open('script.js', 'r') as f:
    content = f.read()

old_header_logic = """                let groupRowHtml = `<th class="header-group sticky-col sticky-col-1" rowspan="2" width="40" style="left:0; z-index:12;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button class="btn-expand-all" style="background: none; border: none; cursor: pointer; color: #8c9bb3; display: flex; align-items: center; justify-content: center; padding: 2px;" title="全部展開/折疊">
                            <i class="ph ph-caret-right" style="transition: transform 0.2s;"></i>
                        </button>
                        <input type="checkbox" id="selectAllCheckboxCompact">
                    </div>
                </th>`;
                let subRowHtml = ``;

                let currentLeft = 40; // Starts after checkbox

                // Pinned headers span both rows (rowspan="2")
                pinned.forEach(col => {
                    groupRowHtml += `<th class="header-group sticky-col" rowspan="2" style="left:${currentLeft}px; min-width:110px; z-index:12;" data-col="${col.id}">
                        <div style="display:flex;align-items:center;white-space:nowrap;justify-content:space-between;">
                            <div style="display:flex;align-items:center;">
                                <span>${typeof col.label === 'function' ? col.label() : col.label}</span>
                            </div>
                            ${getActionMenuHtml(col, true)}
                        </div>
                    </th>`;
                    currentLeft += 110;
                });

                // Action header (fixed on the right) with Image 2 Icon
                const actionCol = visibleColumnsConfig.find(col => col.id === 'action');
                let actionHeaderHtml = '';
                if (actionCol) {
                    actionHeaderHtml = `<th class="header-group sticky-col-right" rowspan="2" data-col="action" style="min-width: 60px; z-index:12;">
                        <div style="display:flex;align-items:center;white-space:nowrap;justify-content:center;">
                            <button type="button" class="btn-custom-columns-header btn-header-columns-toggle" title="自订栏位">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <rect x="3" y="3" width="4" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
                                    <rect x="9" y="3" width="4" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
                                </svg>
                            </button>
                        </div>
                    </th>`;
                }

                // Unpinned headers grouped sequentially
                let currentGroup = '';
                let groupColSpan = 0;
                
                const unpinnedWithoutAction = unpinned.filter(col => col.id !== 'action');
                unpinnedWithoutAction.forEach(col => {
                    if (col.group !== currentGroup) {
                        if (currentGroup !== '') {
                            groupRowHtml += `<th class="header-group" colspan="${groupColSpan}">${currentGroup}</th>`;
                        }
                        currentGroup = col.group;
                        groupColSpan = 1;
                    } else {
                        groupColSpan++;
                    }

                    subRowHtml += `<th class="header-sub" data-col="${col.id}">
                        <div style="display:flex;align-items:center;white-space:nowrap;justify-content:space-between;">
                            <div style="display:flex;align-items:center;">
                                <span>${typeof col.label === 'function' ? col.label() : col.label}</span>
                            </div>
                            ${getActionMenuHtml(col, false)}
                        </div>
                    </th>`;
                });

                if (currentGroup !== '') {
                    groupRowHtml += `<th class="header-group" colspan="${groupColSpan}">${currentGroup}</th>`;
                }

                if (actionHeaderHtml) {
                    groupRowHtml += actionHeaderHtml;
                }

                userTableHeader.innerHTML = `
                    <tr class="header-group-row">${groupRowHtml}</tr>
                    <tr class="header-sub-row">${subRowHtml}</tr>
                `;"""

new_header_logic = """                let headerHtml = `<th class="header-group sticky-col sticky-col-1" width="40" style="left:0; z-index:12;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button class="btn-expand-all" style="background: none; border: none; cursor: pointer; color: #8c9bb3; display: flex; align-items: center; justify-content: center; padding: 2px;" title="全部展開/折疊">
                            <i class="ph ph-caret-right" style="transition: transform 0.2s;"></i>
                        </button>
                        <input type="checkbox" id="selectAllCheckboxCompact">
                    </div>
                </th>`;

                let currentLeft = 40;

                pinned.forEach(col => {
                    headerHtml += `<th class="header-group sticky-col" style="left:${currentLeft}px; min-width:110px; z-index:12;" data-col="${col.id}">
                        <div style="display:flex;align-items:center;white-space:nowrap;justify-content:space-between;">
                            <div style="display:flex;align-items:center;">
                                <span>${typeof col.label === 'function' ? col.label() : col.label}</span>
                            </div>
                            ${getActionMenuHtml(col, true)}
                        </div>
                    </th>`;
                    currentLeft += 110;
                });
                
                const unpinnedWithoutAction = unpinned.filter(col => col.id !== 'action');
                unpinnedWithoutAction.forEach(col => {
                    headerHtml += `<th class="header-sub" data-col="${col.id}">
                        <div style="display:flex;align-items:center;white-space:nowrap;justify-content:space-between;">
                            <div style="display:flex;align-items:center;">
                                <span>${typeof col.label === 'function' ? col.label() : col.label}</span>
                            </div>
                            ${getActionMenuHtml(col, false)}
                        </div>
                    </th>`;
                });

                const actionCol = visibleColumnsConfig.find(col => col.id === 'action');
                if (actionCol) {
                    headerHtml += `<th class="header-group sticky-col-right" data-col="action" style="min-width: 60px; z-index:12;">
                        <div style="display:flex;align-items:center;white-space:nowrap;justify-content:center;">
                            <button type="button" class="btn-custom-columns-header btn-header-columns-toggle" title="自订栏位">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <rect x="3" y="3" width="4" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
                                    <rect x="9" y="3" width="4" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
                                </svg>
                            </button>
                        </div>
                    </th>`;
                }

                userTableHeader.innerHTML = `<tr class="header-sub-row">${headerHtml}</tr>`;"""

content = content.replace(old_header_logic, new_header_logic)

with open('script.js', 'w') as f:
    f.write(content)

print("Grouping header removed.")
