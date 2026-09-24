const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf-8');

// The replacement logic: we need to replace the entire renderDrawerStates and its helpers.
const newRenderLogic = `
    function renderDrawerStates() {
        const col1 = document.getElementById('col1-table-fields');
        const col2 = document.getElementById('col2-card-fields');
        const col3 = document.getElementById('col3-backup-fields');
        
        if (!col1 || !col2 || !col3) return;

        col1.innerHTML = '';
        col2.innerHTML = '';
        col3.innerHTML = '';

        const activeLists = getActiveLists();

        // 1. Render Table Fields (Column 1)
        activeLists.frozen.forEach((col, idx) => {
            col1.appendChild(createCol1Item(col, idx, 'frozen'));
        });
        activeLists.scroll.forEach((col, idx) => {
            col1.appendChild(createCol1Item(col, idx, 'scroll'));
        });

        // Split availableDataSource into card fields and backup fields
        const cardFields = [];
        const backupFields = [];
        availableDataSource.forEach(col => {
            if (dataSourceFieldVisibility[col.id] !== false) {
                cardFields.push(col);
            } else {
                backupFields.push(col);
            }
        });

        // 2. Render Card Fields (Column 2) - Grouped by accordion
        const groupedCardFields = {};
        cardFields.forEach(col => {
            const cat = col.category || '其他';
            if (!groupedCardFields[cat]) groupedCardFields[cat] = [];
            groupedCardFields[cat].push(col);
        });

        for (const cat in groupedCardFields) {
            const block = document.createElement('div');
            block.className = 'category-block';
            block.style.marginBottom = '12px';
            block.style.border = '1px solid #e2e8f0';
            block.style.borderRadius = '6px';
            block.style.overflow = 'hidden';
            
            // For dragging group
            block.draggable = true;
            block.dataset.cat = cat;

            const isVisible = drawerCategoryVisibility[cat] !== false;
            
            // Accordion Header
            block.innerHTML = \`
                <div class="category-title" style="padding: 10px 12px; background: \${isVisible ? '#f8fafc' : '#f1f5f9'}; display: flex; align-items: center; justify-content: space-between; cursor: move;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <button type="button" class="btn-action-icon" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer;" onclick="window.toggleCategoryVisibility('\${cat}')">
                            <i class="ph \${isVisible ? 'ph-caret-down' : 'ph-caret-right'}"></i>
                        </button>
                        <i class="ph-fill ph-folder-notch" style="color: \${isVisible ? 'var(--primary-color)' : '#94a3b8'};"></i>
                        <span style="font-size:13px; font-weight:600; color: \${isVisible ? 'var(--text-main)' : '#94a3b8'};">\${cat}</span>
                    </div>
                </div>
            \`;

            // Accordion Body
            const grid = document.createElement('div');
            grid.style.padding = '8px';
            grid.style.display = isVisible ? 'flex' : 'none';
            grid.style.flexDirection = 'column';
            grid.style.gap = '6px';
            grid.style.background = '#fff';
            
            if (isVisible) {
                groupedCardFields[cat].forEach(col => {
                    grid.appendChild(createCol2Item(col));
                });
            }
            block.appendChild(grid);
            col2.appendChild(block);
        }

        // Sink hidden categories to bottom visually (or sort them later if needed, here we just rendered them as they are, but PRD says sink to bottom)
        // Let's sort groupedCardFields so hidden ones are at the end:
        const catKeys = Object.keys(groupedCardFields).sort((a, b) => {
            const visA = drawerCategoryVisibility[a] !== false;
            const visB = drawerCategoryVisibility[b] !== false;
            if (visA === visB) return 0;
            return visA ? -1 : 1; // true comes first
        });
        col2.innerHTML = ''; // Re-render sorted
        catKeys.forEach(cat => {
            const block = document.createElement('div');
            block.className = 'category-block';
            block.style.marginBottom = '12px';
            block.style.border = '1px solid #e2e8f0';
            block.style.borderRadius = '6px';
            block.style.overflow = 'hidden';
            block.style.opacity = drawerCategoryVisibility[cat] !== false ? '1' : '0.6';
            
            block.draggable = true;
            block.dataset.cat = cat;
            const isVisible = drawerCategoryVisibility[cat] !== false;
            
            block.innerHTML = \`
                <div class="category-title" style="padding: 10px 12px; background: \${isVisible ? '#f8fafc' : '#f1f5f9'}; display: flex; align-items: center; justify-content: space-between; cursor: move;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <button type="button" class="btn-action-icon" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer;" onclick="window.toggleCategoryVisibility('\${cat}')">
                            <i class="ph \${isVisible ? 'ph-caret-down' : 'ph-caret-right'}"></i>
                        </button>
                        <i class="ph-fill ph-folder-notch" style="color: \${isVisible ? 'var(--primary-color)' : '#94a3b8'};"></i>
                        <span style="font-size:13px; font-weight:600; color: \${isVisible ? 'var(--text-main)' : '#94a3b8'};">\${cat}</span>
                    </div>
                </div>
            \`;
            const grid = document.createElement('div');
            grid.style.padding = '8px';
            grid.style.display = isVisible ? 'flex' : 'none';
            grid.style.flexDirection = 'column';
            grid.style.gap = '6px';
            grid.style.background = '#fff';
            if (isVisible) {
                groupedCardFields[cat].forEach(col => {
                    grid.appendChild(createCol2Item(col));
                });
            }
            block.appendChild(grid);
            col2.appendChild(block);
        });

        // 3. Render Backup Fields (Column 3)
        backupFields.forEach(col => {
            col3.appendChild(createCol3Item(col));
        });

        initDragAndDrop();
        updateTableFromDrawer();
    }

    function createCol1Item(col, index, type) {
        const div = document.createElement('div');
        div.className = 'column-item';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.padding = '8px 12px';
        div.style.background = type === 'frozen' ? '#f8fafc' : '#fff';
        div.style.border = '1px solid #e2e8f0';
        div.style.borderRadius = '6px';
        div.style.marginBottom = '6px';
        
        div.draggable = true;
        div.dataset.id = col.id;
        div.dataset.type = type;

        const isNative = col.isNative === true;
        const isMandatory = ['uid', 'account', 'memberInfo'].includes(col.id);

        let actionButtons = '';
        
        // Sorting buttons
        actionButtons += \`<button type="button" class="btn-action-icon" onclick="window.moveColumnUp('\${col.id}', '\${type}')" \${index === 0 ? 'disabled style="opacity: 0.5;"' : ''}><i class="ph ph-arrow-up"></i></button>\`;
        actionButtons += \`<button type="button" class="btn-action-icon" onclick="window.moveColumnDown('\${col.id}', '\${type}')"><i class="ph ph-arrow-down"></i></button>\`;
        
        if (!isMandatory) {
            // Move to Card
            actionButtons += \`<button type="button" class="btn-action-icon" style="color:#0369a1;" title="移至卡片" onclick="window.demoteColumnToCard('\${col.id}', '\${type}')"><i class="ph ph-arrow-circle-right"></i></button>\`;
            // Hide (Move to Backup)
            actionButtons += \`<button type="button" class="btn-action-icon" style="color:#ef4444;" title="隐藏" onclick="window.demoteColumnToBackup('\${col.id}', '\${type}')"><i class="ph ph-x"></i></button>\`;
        }

        div.innerHTML = \`
            <div class="column-item-left" style="display:flex; align-items:center; gap:8px; flex:1; min-width:0;">
                \${isMandatory ? '<i class="ph ph-lock-key" style="color:#94a3b8;"></i>' : '<i class="ph ph-dots-six-vertical" style="color:#cbd5e1; cursor:grab;"></i>'}
                <span class="column-name" style="font-size:13px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">\${col.label}</span>
            </div>
            <div class="column-item-actions" style="display:flex; gap:4px;">
                \${actionButtons}
            </div>
        \`;
        return div;
    }

    function createCol2Item(col) {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.padding = '6px 10px';
        div.style.background = '#f8fafc';
        div.style.border = '1px solid #e2e8f0';
        div.style.borderRadius = '4px';
        div.draggable = true;
        div.dataset.id = col.id;
        
        div.innerHTML = \`
            <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:0;">
                <i class="ph ph-dots-six-vertical" style="color:#cbd5e1; cursor:grab;"></i>
                <span style="font-size:13px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">\${col.label}</span>
            </div>
            <div style="display:flex; gap:4px;">
                <button type="button" class="btn-action-icon" style="color:#4338ca;" title="提至表格" onclick="window.promoteColumnFromCard('\${col.id}')"><i class="ph ph-arrow-circle-left"></i></button>
                <button type="button" class="btn-action-icon" style="color:#ef4444;" title="隐藏" onclick="window.hideCardColumn('\${col.id}')"><i class="ph ph-x"></i></button>
            </div>
        \`;
        return div;
    }

    function createCol3Item(col) {
        const div = document.createElement('div');
        div.style.display = 'inline-flex';
        div.style.alignItems = 'center';
        div.style.padding = '4px 10px';
        div.style.background = '#f1f5f9';
        div.style.border = '1px solid #cbd5e1';
        div.style.borderRadius = '9999px';
        div.style.fontSize = '12px';
        div.style.fontWeight = '500';
        div.style.color = '#334155';
        div.style.gap = '6px';
        div.draggable = true;
        div.dataset.id = col.id;
        
        div.innerHTML = \`
            <i class="ph ph-dots-six-vertical" style="color:#cbd5e1; cursor:grab;"></i>
            <span>\${col.label}</span>
            <div style="display:flex; gap:2px; margin-left:4px;">
                <button type="button" class="btn-action-icon" style="color:#4338ca; width:20px; height:20px;" title="加至表格" onclick="window.promoteColumnFromBackup('\${col.id}')"><i class="ph ph-list-plus"></i></button>
                <button type="button" class="btn-action-icon" style="color:#0369a1; width:20px; height:20px;" title="加至卡片" onclick="window.addBackupToCard('\${col.id}')"><i class="ph ph-squares-four"></i></button>
            </div>
        \`;
        return div;
    }

    // --- Action Methods ---
    
    window.demoteColumnToCard = function(id, type) {
        const list = type === 'frozen' ? getActiveLists().frozen : getActiveLists().scroll;
        const idx = list.findIndex(c => c.id === id);
        if (idx > -1) {
            const col = list.splice(idx, 1)[0];
            availableDataSource.push(col);
            dataSourceFieldVisibility[col.id] = true;
            renderDrawerStates();
            updateTableFromDrawer();
        }
    };

    window.demoteColumnToBackup = function(id, type) {
        const list = type === 'frozen' ? getActiveLists().frozen : getActiveLists().scroll;
        const idx = list.findIndex(c => c.id === id);
        if (idx > -1) {
            const col = list.splice(idx, 1)[0];
            availableDataSource.push(col);
            dataSourceFieldVisibility[col.id] = false;
            renderDrawerStates();
            updateTableFromDrawer();
        }
    };

    window.promoteColumnFromCard = function(id) {
        const idx = availableDataSource.findIndex(c => c.id === id);
        if (idx > -1) {
            const col = availableDataSource.splice(idx, 1)[0];
            col.isNative = false;
            if (currentTableMode === 'nested') {
                nestedScrollColumns.push(col);
                nestedColumnVisibility[col.id] = true;
            } else {
                compactScrollColumns.push(col);
                compactColumnVisibility[col.id] = true;
            }
            // Cleanup card visibility flag
            delete dataSourceFieldVisibility[col.id];
            renderDrawerStates();
            updateTableFromDrawer();
        }
    };

    window.hideCardColumn = function(id) {
        dataSourceFieldVisibility[id] = false;
        renderDrawerStates();
    };

    window.promoteColumnFromBackup = function(id) {
        // Backup to table is same logic as card to table
        window.promoteColumnFromCard(id);
    };

    window.addBackupToCard = function(id) {
        dataSourceFieldVisibility[id] = true;
        renderDrawerStates();
    };
`;

// Replace `function renderDrawerStates() { ... }` up to `window.promoteColumn = ...`
const startIdx = content.indexOf('function renderDrawerStates() {');
const endIdx = content.indexOf('window.moveColumnUp = function(id, type) {');

if (startIdx !== -1 && endIdx !== -1) {
    const originalChunk = content.substring(startIdx, endIdx);
    content = content.substring(0, startIdx) + newRenderLogic + '\n    ' + content.substring(endIdx);
    fs.writeFileSync('script.js', content);
    console.log("Successfully replaced render logic.");
} else {
    console.log("Failed to find start or end index.");
}

