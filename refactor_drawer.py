import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove old functions: createCol1Item, createCol2Item, createCol3Item
content = re.sub(r"function createCol1Item\([^\{]+\{[\s\S]*?\n    \}\n\n    function createCol2Item\([^\{]+\{[\s\S]*?\n    \}", "", content)
content = re.sub(r"function createCol3Item\([^\{]+\{[\s\S]*?\n    \}", "", content)

# 2. Add the new helper functions before renderDrawerStates
helpers = """
    function renderPills(cols, isLeftPanel) {
        let html = '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
        cols.forEach(col => {
            const isMandatory = ['uid', 'account', 'action', 'memberInfo'].includes(col.id);
            const inMainTable = currentTableMode === 'nested' ? 
                nestedColumnsConfig.some(c => c.id === col.id) : 
                compactColumnsConfig.some(c => c.id === col.id);
            
            if (!isLeftPanel && inMainTable) {
                html += `
                <div data-id="${col.id}" style="display: inline-flex;">
                    <label style="border: 1px solid #f1f5f9; border-radius: 4px; padding: 6px 12px; display: inline-flex; align-items: center; gap: 8px; color: #94a3b8; background: #f8fafc; font-size: 13px; font-weight: 500; cursor: not-allowed; text-decoration: line-through;">
                        <input type="checkbox" checked disabled style="accent-color: #3b82f6; width: 14px; height: 14px; margin: 0; cursor: not-allowed;">
                        <span>${col.label || col.name || col.id}</span>
                        <div style="background: #eef2ff; color: #4f46e5; font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">已在主表</div>
                    </label>
                </div>
                `;
            } else {
                const isChecked = isLeftPanel ? (tableFieldVisibility[col.id] !== false) : (dataSourceFieldVisibility[col.id] !== false);
                const onChangeHtml = isLeftPanel ? `onchange="window.toggleTableFieldVisibility('${col.id}', this.checked)"` : `onchange="window.toggleDataSourceFieldVisibility('${col.id}')"`;
                
                const color = isChecked ? '#3b82f6' : '#64748b';
                const bg = isChecked ? '#eff6ff' : '#fff';
                const border = isChecked ? '#bfdbfe' : '#e2e8f0';
                
                html += `
                <div data-id="${col.id}" style="display: inline-flex;">
                    <label style="border: 1px solid ${border}; border-radius: 4px; padding: 6px 12px; display: inline-flex; align-items: center; gap: 8px; color: ${color}; background: ${bg}; font-size: 13px; font-weight: 500; cursor: pointer; ${isMandatory ? 'opacity: 0.8;' : ''}">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} ${isMandatory ? 'disabled' : onChangeHtml} style="accent-color: #3b82f6; width: 14px; height: 14px; margin: 0; ${isMandatory ? 'cursor: not-allowed;' : 'cursor: pointer;'}">
                        <span style="cursor: pointer; user-select: none;">${col.label || col.name || col.id} ${isMandatory ? '<i class="ph-fill ph-lock-key" style="color:#3b82f6; font-size:12px; margin-left:2px;"></i>' : ''}</span>
                        `;
                
                if (isLeftPanel) {
                    html += `
                        <div style="display:flex; align-items:center; margin-left: 4px; gap: 2px; border-left: 1px solid ${border}; padding-left: 6px;">
                            <button type="button" style="background:none; border:none; color:#94a3b8; cursor:pointer; padding: 0 4px; display:flex; align-items:center; justify-content:center;" onclick="window.moveColumnLeft('${col.id}')" title="向左移动"><i class="ph-bold ph-caret-left"></i></button>
                            ${(!isMandatory && availableDataSource.some(c => c.id === col.id)) ? `<button type="button" style="background:none; border:none; color:#94a3b8; cursor:pointer; padding: 0 4px; display:flex; align-items:center; justify-content:center;" onclick="window.demoteColumnToCard('${col.id}')" title="移除"><i class="ph-bold ph-minus"></i></button>` : ''}
                            <button type="button" style="background:none; border:none; color:#94a3b8; cursor:pointer; padding: 0 4px; display:flex; align-items:center; justify-content:center;" onclick="window.moveColumnRight('${col.id}')" title="向右移动"><i class="ph-bold ph-caret-right"></i></button>
                        </div>
                    `;
                } else {
                    html += `
                        <div style="display:flex; align-items:center; margin-left: 4px; border-left: 1px solid ${border}; padding-left: 6px;">
                            <button type="button" style="background:none; border:none; color:#3b82f6; cursor:pointer; padding: 0 4px; display:flex; align-items:center; justify-content:center;" onclick="window.promoteColumnFromCard('${col.id}')" title="加入表格"><i class="ph-bold ph-plus"></i></button>
                        </div>
                    `;
                }
                html += `
                    </label>
                </div>
                `;
            }
        });
        html += '</div>';
        return html;
    }

    function renderCategoryCard(groupName, cols, isLeftPanel) {
        const catIcons = {
            '存取款资料': 'ph-bold ph-wallet',
            '推荐关系': 'ph-bold ph-share-network',
            '余额宝': 'ph-bold ph-wallet',
            '信贷': 'ph-bold ph-credit-card',
            '用户标签': 'ph-bold ph-tag',
            '其他': 'ph-bold ph-folder',
            '大头照': 'ph-bold ph-user-square',
            '基本资料': 'ph-bold ph-user',
            '基本': 'ph-bold ph-user',
            '成长与积分': 'ph-bold ph-trend-up',
            '主钱包': 'ph-bold ph-wallet',
            '汇总 USDT': 'ph-bold ph-wallet'
        };

        let blockBorder = '#e2e8f0';
        if (groupName === '主钱包') blockBorder = '#bfdbfe';
        else if (groupName === '汇总 USDT') blockBorder = '#e9d5ff';

        const upFn = isLeftPanel ? `window.moveLeftCategoryUp('${groupName}')` : `window.moveRightCategoryUp('${groupName}')`;
        const downFn = isLeftPanel ? `window.moveLeftCategoryDown('${groupName}')` : `window.moveRightCategoryDown('${groupName}')`;

        let innerHtml = `
            <div class="category-block-draggable" data-cat="${groupName}" style="margin-bottom: 24px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; cursor: grab;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <i class="ph-bold ph-dots-six-vertical" style="color: #cbd5e1;"></i>
                        <i class="${catIcons[groupName] || 'ph-bold ph-folder'}" style="color: #94a3b8; font-size: 16px;"></i>
                        <span style="font-size: 14px; font-weight: 600; color: #475569;">${groupName}</span>
                    </div>
                    <div style="display:flex; align-items:center; border: 1px solid #e2e8f0; background: #fff; border-radius: 6px; overflow: hidden;" onclick="event.stopPropagation()">
                        <button type="button" style="background:none; border:none; color:#94a3b8; cursor:pointer; padding: 4px 8px; border-right: 1px solid #e2e8f0; display:flex; align-items:center; justify-content:center;" onclick="${upFn}" title="向上移动"><i class="ph-bold ph-caret-up"></i></button>
                        <button type="button" style="background:none; border:none; color:#94a3b8; cursor:pointer; padding: 4px 8px; display:flex; align-items:center; justify-content:center;" onclick="${downFn}" title="向下移动"><i class="ph-bold ph-caret-down"></i></button>
                    </div>
                </div>
        `;

        if (groupName === '存取款资料') {
            const mainWalletCols = cols.filter(c => c.tag === '主钱包');
            const summaryCols = cols.filter(c => c.tag === '汇总');
            
            innerHtml += `
                <div style="border: 1px solid #eff6ff; border-radius: 6px; background: #f8fafc; padding: 12px; margin-bottom: 12px;">
                    <div style="font-size: 13px; font-weight: 600; color: #1d4ed8; margin-bottom: 12px;">主钱包</div>
                    ${renderPills(mainWalletCols, isLeftPanel)}
                </div>
                <div style="border: 1px solid #faf5ff; border-radius: 6px; background: #f8fafc; padding: 12px;">
                    <div style="font-size: 13px; font-weight: 600; color: #7e22ce; margin-bottom: 12px;">汇总 (USDT)</div>
                    ${renderPills(summaryCols, isLeftPanel)}
                </div>
            `;
        } else {
            innerHtml += `
                <div style="border: 1px solid ${blockBorder}; border-radius: 6px; background: #f8fafc; padding: 12px;">
                    ${renderPills(cols, isLeftPanel)}
                </div>
            `;
        }
        innerHtml += `</div>`;
        return innerHtml;
    }

    function renderDrawerStates() {
"""

content = content.replace("    function renderDrawerStates() {", helpers)

# 3. Rewrite renderDrawerStates body
render_drawer_pattern = r"    function renderDrawerStates\(\) \{[\s\S]*?(?=    function updateTableFromDrawer)"
new_render_drawer = """    function renderDrawerStates() {
        const col1 = document.getElementById('col1-table-fields');
        const col2 = document.getElementById('col2-card-fields');
        const col3 = document.getElementById('col3-backup-fields');

        if (!col1 || !col2 || !col3) return;

        col1.innerHTML = '';
        col2.innerHTML = '';
        col3.innerHTML = '';

        const list = currentTableMode === 'nested' ? nestedColumnsConfig : compactColumnsConfig;
        
        // --- Left Panel ---
        const leftGroups = {};
        const leftGroupOrder = [];
        list.forEach(col => {
            if (['action'].includes(col.id)) return;
            const grp = col.group || col.category || '其他';
            if (!leftGroups[grp]) {
                leftGroups[grp] = [];
                leftGroupOrder.push(grp);
            }
            leftGroups[grp].push(col);
        });

        leftGroupOrder.forEach(grp => {
            col1.innerHTML += renderCategoryCard(grp, leftGroups[grp], true);
        });

        // --- Right Panel ---
        const rightGroups = {};
        availableDataSource.forEach(col => {
            const grp = col.category || '其他';
            if (!rightGroups[grp]) rightGroups[grp] = [];
            rightGroups[grp].push(col);
        });

        const catKeys = Object.keys(rightGroups).sort((a, b) => {
            const idxA = drawerCategoryOrder.indexOf(a);
            const idxB = drawerCategoryOrder.indexOf(b);
            return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
        });

        catKeys.forEach(grp => {
            col2.innerHTML += renderCategoryCard(grp, rightGroups[grp], false);
        });

        const badge1 = document.getElementById('badge-col1');
        const badge2 = document.getElementById('badge-col2');
        if (badge1) badge1.textContent = list.length - 1; // subtract action
        if (badge2) badge2.textContent = availableDataSource.length;
    }
"""

content = re.sub(render_drawer_pattern, new_render_drawer, content)

# 4. Rewrite movement logic
movement_pattern = r"    window\.moveColumnUp = function [\s\S]*?(?=    // Withdrawal Info Add logic)"

new_movement = """    window.moveColumnLeft = function (id) {
        let list = currentTableMode === 'nested' ? nestedColumnsConfig : compactColumnsConfig;
        const idx = list.findIndex(c => c.id === id);
        if (idx > 0) {
            const temp = list[idx - 1];
            list[idx - 1] = list[idx];
            list[idx] = temp;
            renderDrawerStates();
            updateTableFromDrawer();
        }
    };

    window.moveColumnRight = function (id) {
        let list = currentTableMode === 'nested' ? nestedColumnsConfig : compactColumnsConfig;
        const idx = list.findIndex(c => c.id === id);
        if (idx > -1 && idx < list.length - 1) {
            const temp = list[idx + 1];
            list[idx + 1] = list[idx];
            list[idx] = temp;
            renderDrawerStates();
            updateTableFromDrawer();
        }
    };

    window.moveLeftCategoryUp = function(groupName) {
        let list = currentTableMode === 'nested' ? nestedColumnsConfig : compactColumnsConfig;
        const leftGroups = {};
        const leftGroupOrder = [];
        list.forEach(col => {
            if (['action'].includes(col.id)) return;
            const grp = col.group || col.category || '其他';
            if (!leftGroups[grp]) {
                leftGroups[grp] = [];
                leftGroupOrder.push(grp);
            }
            leftGroups[grp].push(col);
        });
        const idx = leftGroupOrder.indexOf(groupName);
        if (idx > 0) {
            const temp = leftGroupOrder[idx - 1];
            leftGroupOrder[idx - 1] = leftGroupOrder[idx];
            leftGroupOrder[idx] = temp;
            const newList = [];
            leftGroupOrder.forEach(g => newList.push(...leftGroups[g]));
            const actionCol = list.find(c => c.id === 'action');
            if (actionCol) newList.push(actionCol);
            
            if (currentTableMode === 'nested') {
                nestedColumnsConfig.length = 0;
                nestedColumnsConfig.push(...newList);
            } else {
                compactColumnsConfig.length = 0;
                compactColumnsConfig.push(...newList);
            }
            renderDrawerStates();
            updateTableFromDrawer();
        }
    };

    window.moveLeftCategoryDown = function(groupName) {
        let list = currentTableMode === 'nested' ? nestedColumnsConfig : compactColumnsConfig;
        const leftGroups = {};
        const leftGroupOrder = [];
        list.forEach(col => {
            if (['action'].includes(col.id)) return;
            const grp = col.group || col.category || '其他';
            if (!leftGroups[grp]) {
                leftGroups[grp] = [];
                leftGroupOrder.push(grp);
            }
            leftGroups[grp].push(col);
        });
        const idx = leftGroupOrder.indexOf(groupName);
        if (idx > -1 && idx < leftGroupOrder.length - 1) {
            const temp = leftGroupOrder[idx + 1];
            leftGroupOrder[idx + 1] = leftGroupOrder[idx];
            leftGroupOrder[idx] = temp;
            const newList = [];
            leftGroupOrder.forEach(g => newList.push(...leftGroups[g]));
            const actionCol = list.find(c => c.id === 'action');
            if (actionCol) newList.push(actionCol);
            
            if (currentTableMode === 'nested') {
                nestedColumnsConfig.length = 0;
                nestedColumnsConfig.push(...newList);
            } else {
                compactColumnsConfig.length = 0;
                compactColumnsConfig.push(...newList);
            }
            renderDrawerStates();
            updateTableFromDrawer();
        }
    };
    
    window.moveRightCategoryUp = function(catName) {
        const idx = drawerCategoryOrder.indexOf(catName);
        if (idx > 0) {
            const temp = drawerCategoryOrder[idx - 1];
            drawerCategoryOrder[idx - 1] = drawerCategoryOrder[idx];
            drawerCategoryOrder[idx] = temp;
            renderDrawerStates();
        }
    };

    window.moveRightCategoryDown = function(catName) {
        const idx = drawerCategoryOrder.indexOf(catName);
        if (idx > -1 && idx < drawerCategoryOrder.length - 1) {
            const temp = drawerCategoryOrder[idx + 1];
            drawerCategoryOrder[idx + 1] = drawerCategoryOrder[idx];
            drawerCategoryOrder[idx] = temp;
            renderDrawerStates();
        }
    };

    function updateTableFromDrawer() {
        if (typeof renderTable === 'function') {
            renderTable(true);
        }
    }
"""

content = re.sub(movement_pattern, new_movement, content)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

