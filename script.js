document.addEventListener('DOMContentLoaded', () => {




    // Drawer Elements
    const openBtn = document.getElementById('openAdvancedFilter');
    const closeBtn = document.getElementById('closeAdvancedFilter');
    const drawer = document.getElementById('advancedDrawer');
    const overlay = document.getElementById('overlay');
    const btnApply = document.getElementById('btnApply');
    const btnClearDrawer = document.getElementById('btnClearDrawer');

    // Filter Controls (Dynamic custom select instances)
    const dropdownStatus = document.getElementById('dropdownStatus');
    const dropdownLevel = document.getElementById('dropdownLevel');
    const dropdownVip = document.getElementById('dropdownVip');
    const dropdownOther = document.getElementById('dropdownOther');
    const inputAccount = document.getElementById('inputAccount');

    // Account Type Dropdown Controls
    const accountTypeSelected = document.getElementById('accountTypeSelected');
    const accountTypeMenu = document.getElementById('accountTypeMenu');
    const accountTypeText = document.getElementById('accountTypeText');
    let currentAccountType = 'exact'; // Default type: exact

    // Toggle Account Type Dropdown
    if (accountTypeSelected && accountTypeMenu) {
        accountTypeSelected.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            accountTypeMenu.classList.toggle('show');
        });

        // Handle account type selection
        accountTypeMenu.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', (e) => {
                accountTypeMenu.querySelectorAll('li').forEach(li => li.classList.remove('active'));
                item.classList.add('active');
                
                const value = item.getAttribute('data-value');
                currentAccountType = value;
                
                const selectedText = item.querySelector('span').textContent;
                if (accountTypeText) accountTypeText.textContent = selectedText;

                // Change placeholder and clear value
                if (inputAccount) {
                    if (value === 'exact') {
                        inputAccount.placeholder = '請輸入精確帳號';
                    } else if (value === 'fuzzy') {
                        inputAccount.placeholder = '請輸入模糊帳號關鍵字';
                    } else if (value === 'multi') {
                        inputAccount.placeholder = "帐号以';'隔开，上限限制 50 个帐号";
                    } else {
                        inputAccount.placeholder = `請輸入${selectedText}`;
                    }
                    inputAccount.value = '';
                }
                
                accountTypeMenu.classList.remove('show');
            });
        });
    }

    // Toggle for Filter Test Accounts
    const filterTestAccountsToggle = document.getElementById('filterTestAccountsToggle');
    if (filterTestAccountsToggle) {
        filterTestAccountsToggle.addEventListener('change', () => {
            updateFilters();
            renderTable();
        });
    }

    // Helper: Close all dropdown menus
    function closeAllDropdowns() {
        document.querySelectorAll('.select-options').forEach(el => el.classList.remove('show'));
        if (typeof accountTypeMenu !== 'undefined' && accountTypeMenu) accountTypeMenu.classList.remove('show');
        const colToggle = document.getElementById('columnToggleDropdown');
        if (colToggle) colToggle.classList.remove('show');
        const batchMenu = document.getElementById('batchOperationsMenu');
        if (batchMenu) batchMenu.classList.remove('show');
        const exportMenu = document.getElementById('exportDataMenu');
        if (exportMenu) exportMenu.classList.remove('show');
        const basicFieldsDropdown = document.getElementById('basicFieldsDropdown');
        if (basicFieldsDropdown) basicFieldsDropdown.style.display = 'none';
    }

    // Close Dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-single') && 
            !e.target.closest('.custom-select-multi') && 
            !e.target.closest('.account-type-dropdown') &&
            !e.target.closest('.column-toggle-container') &&
            !e.target.closest('.batch-dropdown-container') &&
            !e.target.closest('.export-dropdown-container') &&
            !e.target.closest('.basic-fields-toggle-container')) {
            closeAllDropdowns();
        }
    });

    // Basic Fields Dropdown Toggler
    const btnFilterFieldsToggle = document.getElementById('btnFilterFieldsToggle');
    const basicFieldsDropdown = document.getElementById('basicFieldsDropdown');
    if (btnFilterFieldsToggle && basicFieldsDropdown) {
        btnFilterFieldsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = basicFieldsDropdown.style.display === 'block';
            closeAllDropdowns();
            if (!isOpen) {
                basicFieldsDropdown.style.display = 'block';
            }
        });

        basicFieldsDropdown.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const fieldName = e.target.getAttribute('data-field');
                const fieldElement = document.querySelector(`#filterRow [data-field="${fieldName}"]`);
                if (fieldElement) {
                    fieldElement.style.display = e.target.checked ? '' : 'none';
                }
            });
        });
    }

    // Batch Operations Dropdown Toggler
    const btnBatchOperations = document.getElementById('btnBatchOperations');
    const batchOperationsMenu = document.getElementById('batchOperationsMenu');
    if (btnBatchOperations && batchOperationsMenu) {
        btnBatchOperations.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = batchOperationsMenu.classList.contains('show');
            closeAllDropdowns();
            if (!isOpen) {
                batchOperationsMenu.classList.add('show');
            }
        });

        batchOperationsMenu.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                alert(`觸發操作：${li.textContent.trim()}`);
                batchOperationsMenu.classList.remove('show');
            });
        });
    }

    // Export Data Dropdown Toggler
    const btnExportData = document.getElementById('btnExportData');
    const exportDataMenu = document.getElementById('exportDataMenu');
    if (btnExportData && exportDataMenu) {
        btnExportData.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = exportDataMenu.classList.contains('show');
            closeAllDropdowns();
            if (!isOpen) {
                exportDataMenu.classList.add('show');
            }
        });

        exportDataMenu.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                alert(`觸發操作：${li.textContent.trim()}`);
                exportDataMenu.classList.remove('show');
            });
        });
    }

    // Custom Dropdown single-select initializer
    function initSingleSelect(element, onChange) {
        const selected = element.querySelector('.select-selected');
        const selectedValSpan = element.querySelector('.selected-val');
        const optionsList = element.querySelector('.select-options');
        
        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = optionsList.classList.contains('show');
            closeAllDropdowns();
            if (!isOpen) {
                optionsList.classList.add('show');
            }
        });

        optionsList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                optionsList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
                li.classList.add('active');
                selectedValSpan.textContent = li.textContent.trim();
                optionsList.classList.remove('show');
                if (onChange) onChange(li.getAttribute('data-value'));
            });
        });
    }

    // Custom Dropdown multi-select initializer
    function initMultiSelect(element, onChange) {
        const selected = element.querySelector('.select-selected');
        const selectedValSpan = element.querySelector('.selected-val');
        const optionsList = element.querySelector('.select-options');

        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = optionsList.classList.contains('show');
            closeAllDropdowns();
            if (!isOpen) {
                optionsList.classList.add('show');
            }
        });

        optionsList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                const checkbox = li.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                li.classList.toggle('selected', checkbox.checked);
                
                updateDisplay();
                if (onChange) onChange();
            });
        });

        function updateDisplay() {
            const selectedItems = [];
            optionsList.querySelectorAll('li.selected').forEach(li => {
                selectedItems.push(li.getAttribute('data-value'));
            });

            if (selectedItems.length === 0) {
                selectedValSpan.textContent = '請選擇';
            } else if (selectedItems.length === 1) {
                selectedValSpan.textContent = selectedItems[0];
            } else {
                let displayText = selectedItems[0];
                let shownCount = 1;
                for (let i = 1; i < selectedItems.length; i++) {
                    if ((displayText + "、" + selectedItems[i]).length > 10) {
                        break;
                    }
                    displayText += "、" + selectedItems[i];
                    shownCount++;
                }
                
                if (shownCount < selectedItems.length) {
                    selectedValSpan.textContent = `${displayText} + ${selectedItems.length - shownCount}`;
                } else {
                    selectedValSpan.textContent = displayText;
                }
            }
        }
        
        // Initial run
        updateDisplay();
    }

    // Custom selections state
    let selectedStatusVal = '';
    let selectedLevelVal = '';
    let selectedBirthdayOuterVal = '';
    
    const dropdownBirthdayOuter = document.getElementById('dropdownBirthdayOuter');
    if (dropdownBirthdayOuter) {
        initSingleSelect(dropdownBirthdayOuter, (val) => {
            selectedBirthdayOuterVal = val;
        });
    }
    
    if (typeof dropdownStatus !== 'undefined' && dropdownStatus) {
        initSingleSelect(dropdownStatus, (val) => {
            selectedStatusVal = val;
        });
    }

    if (typeof dropdownLevel !== 'undefined' && dropdownLevel) {
        initSingleSelect(dropdownLevel, (val) => {
            selectedLevelVal = val;
        });
    }

    if (typeof dropdownVip !== 'undefined' && dropdownVip) {
        initMultiSelect(dropdownVip, () => {
        });
    }

    if (typeof dropdownOther !== 'undefined' && dropdownOther) {
        initMultiSelect(dropdownOther, () => {
        });
    }

    // Advanced Filter Controls
    const selectBirthday = document.getElementById('selectBirthday');
    const inputDateStart = document.getElementById('inputDateStart');
    const inputDateEnd = document.getElementById('inputDateEnd');
    const inputQuickLogin = document.getElementById('inputQuickLogin') || { value: "" };
    const inputUid = document.getElementById('inputUid') || { value: "" };
    const inputInviteCode = document.getElementById('inputInviteCode') || { value: "" };
    const inputNickname = document.getElementById('inputNickname') || { value: "" };
    const inputRealName = document.getElementById('inputRealName') || { value: "" };
    const inputBankCard = document.getElementById('inputBankCard');
    const inputOfflineDays = document.getElementById('inputOfflineDays');
    const inputIp = document.getElementById('inputIp');
    const inputDeposit = document.getElementById('inputDeposit');

    // Outer fields
    const inputDateStartOuter = document.getElementById('inputDateStartOuter');
    const inputDateEndOuter = document.getElementById('inputDateEndOuter');
    const inputBankCardOuter = document.getElementById('inputBankCardOuter');
    const inputOfflineDaysOuter = document.getElementById('inputOfflineDaysOuter');
    const inputIpOuter = document.getElementById('inputIpOuter');
    const inputDepositOuter = document.getElementById('inputDepositOuter');

    // Actions & Containers
    const btnSearch = document.getElementById('btnSearch');
    const btnReset = document.getElementById('btnReset');
    const btnClearAll = document.getElementById('btnClearAll');
    const filterTagsContainer = document.getElementById('filterTagsContainer');
    const userTableBody = document.getElementById('userTableBody');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const advancedBadge = document.getElementById('advancedBadge');

    // Drawer state toggle
    function openDrawer() {
        drawer.classList.add('active');
        overlay.classList.add('active');
    }

    function closeDrawer() {
        drawer.classList.remove('active');
        const columnsDrawer = document.getElementById('columnsDrawer');
        if (columnsDrawer) columnsDrawer.classList.remove('active');
        const userEditDrawer = document.getElementById('userEditDrawer');
        if (userEditDrawer) userEditDrawer.classList.remove('active');
        overlay.classList.remove('active');
    }

    if (openBtn) openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
    document.getElementById('btnColumnsDrawerClose')?.addEventListener('click', closeDrawer);

    // Table Mode & Pagination States
    let currentTableMode = 'nested'; // 'nested' or 'compact'
    let currentPage = 1;
    let pageSize = 20;

    // Sorting State
    let currentSortColumn = '';
    let currentSortDirection = ''; // 'asc' or 'desc'

    // Pinning State
    let pinnedColumnIds = [];
    let tempPinnedColumnIds = [];
    
    // Nested Visibility State
    const nestedColumnsConfig = [
        { id: 'online', label: '在線' },
        { id: 'avatar', label: '頭像' },
        { id: 'memberInfo', label: '會員信息' },
        { id: 'levelTeam', label: '等級&團隊' },
        { id: 'creditLimit', label: '信用&額度' },
        { id: 'depositWithdraw', label: '存取款' },
        { id: 'tags', label: '標籤' },
        { id: 'status', label: '狀態' },
        { id: 'dateInfo', label: '日期信息' },
        { id: 'remark', label: '備註' }
    ];
    let nestedColumnVisibility = {};
    let tempNestedColumnVisibility = {};
    let nestedPinnedColumnIds = [];
    let tempNestedPinnedColumnIds = [];
    nestedColumnsConfig.forEach(col => { nestedColumnVisibility[col.id] = true; });

    // Compact Visibility State
    let compactColumnVisibility = {};
    let tempCompactColumnVisibility = {};
    let nestedDropdownHtml = '';
    // --- Data State Rendering Helper ---
    function renderDataState(val, type = 'text') {
        if (val === '-' || val === null || val === undefined || val === '' || val === '無數據') {
            return `<span class="data-empty">-</span>`;
        }
        if (val === '未綁定' || val === '未驗證') {
            return `<span class="tag-unbound">${val}</span>`;
        }
        if (val === '無權限') {
            return `<span class="tag-no-permission" title="無權限"><i class="ph-fill ph-lock"></i></span>`;
        }
        if (val === '獲取失敗') {
            return `<span class="data-error" title="獲取失敗"><i class="ph-fill ph-warning-circle"></i></span>`;
        }
        if (val === 'NaN-NaN-NaN' || val === '解析異常') {
            return `<span class="tag-parse-error" title="原數據異常，無法正確解析">${val === 'NaN-NaN-NaN' ? '解析異常' : val}</span>`;
        }
        if (val === '載入中') {
            return `<span class="data-loading" title="載入中"><i class="ph ph-spinner ph-spin"></i></span>`;
        }
        
        // Formats
        if (type === 'bankCard' || type === 'masked') {
            return `<span class="status-bound"><span class="data-masked">${val}</span></span>`;
        }
        if (type === 'longText') {
            return `<span class="text-truncate" title="${val}">${val}</span>`;
        }
        if (type === 'copyable') {
            return `<span class="copyable-text" onclick="alert('已複製：' + '${val}')" title="點擊複製">${val}<i class="ph-bold ph-copy copy-icon"></i></span>`;
        }
        if (type === 'ip') {
            return `<a href="#" class="ip-link" data-ip="${val}" style="color: var(--primary-color); text-decoration: none;">${val}</a> <i class="ph ph-copy copy-ip-btn" data-ip="${val}" style="cursor: pointer; color: var(--text-muted);" title="複製IP"></i>`;
        }
    
        return val;
    }

    const compactColumnsConfig = [
        { id: 'uid', group: '基本', label: '用戶ID', checkboxIndex: 3, render: (user) => `<td class="cell-val" data-col="uid">${renderDataState(user.uid, 'copyable')}</td>` },
        { id: 'account', group: '基本', label: '會員名', checkboxIndex: 3, render: (user) => `<td data-col="account"><a href="#" class="cell-username user-detail-link" data-uid="${user.uid}">${renderDataState(user.account, 'copyable')}</a></td>` },
        { id: 'online', group: '狀態', label: '在線', checkboxIndex: 1, render: (user) => `<td data-col="online"><span class="status-dot-icon" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${user.offlineDays === 0 ? '#10b981' : '#9ca3af'};"></span></td>` },
        { id: 'status', group: '狀態', label: '狀態', checkboxIndex: 1, render: (user) => `<td data-col="status"><span class="user-custom-tag ${user.status === '正常' ? 'tag-green' : user.status === '冻结' ? 'tag-blue' : 'tag-red'}">${user.status}</span></td>` },
        { id: 'avatar', group: '狀態', label: '頭像', checkboxIndex: 2, render: (user) => `<td data-col="avatar"><div class="avatar-cell" style="width:24px;height:24px;border-radius:50%;background:#3b82f6;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;margin:0 auto;">${user.account.charAt(0).toLowerCase()}</div></td>` },
        { id: 'realName', group: '帳號', label: '真實姓名', checkboxIndex: 3, render: (user) => `<td class="cell-val" data-col="realName">${renderDataState(user.realName)}</td>` },
        { id: 'nickname', group: '帳號', label: '暱稱', checkboxIndex: 3, render: (user) => `<td class="cell-val" data-col="nickname">${renderDataState(user.nickname)}</td>` },
        { id: 'agentId', group: '會員信息（詳細）', label: '代理', checkboxIndex: 3, render: (user) => `<td class="cell-val" data-col="agentId">${renderDataState(user.agentId)}</td>` },
        { id: 'inviter', group: '會員信息（詳細）', label: '邀請人', checkboxIndex: 3, render: (user) => `<td class="cell-val" data-col="inviter">${renderDataState(user.inviter)}</td>` },
        { id: 'registerMode', group: '會員信息（詳細）', label: '註冊模式', checkboxIndex: 3, render: (user) => `<td class="cell-val" data-col="registerMode">${user.registerMode}</td>` },
        { id: 'phone', group: '會員信息（詳細）', label: '手機號', checkboxIndex: 3, render: (user) => `<td class="cell-val" data-col="phone">${renderDataState(user.phone, 'phone')}</td>` },
        { id: 'payLevel', group: '等級 & 團隊', label: '支付層級', checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="payLevel">${user.payLevel}</td>` },
        { id: 'growth', group: '等級 & 團隊', label: '成長值', sortable: true, checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="growth">${user.growth}</td>` },
        { id: 'level', group: '等級 & 團隊', label: '等級', checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="level">${user.level}</td>` },
        { id: 'accountType', group: '等級 & 團隊', label: '帳號類型', checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="accountType">${user.accountType}</td>` },
        { id: 'userType', group: '等級 & 團隊', label: '會員類型', checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="userType">${user.userType}</td>` },
        { id: 'inviteCode', group: '等級 & 團隊', label: '邀請碼', checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="inviteCode">${user.inviteCode}</td>` },
        { id: 'directTeam', group: '等級 & 團隊', label: '直屬下級/團隊數', checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="directTeam">${user.directTeam}</td>` },
        { id: 'vipLevel', group: '等級 & 團隊', label: 'VIP等級', checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="vipLevel">${user.vipLevel}</td>` },
        { id: 'vipGrowth', group: '等級 & 團隊', label: 'VIP成長值', sortable: true, checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="vipGrowth">${user.vipGrowth}</td>` },
        { id: 'creditValue', group: '信用 & 額度', label: '信用值', sortable: true, checkboxIndex: 5, render: (user) => `<td class="cell-val" data-col="creditValue">${user.creditValue}</td>` },
        { id: 'availableCredit', group: '信用 & 額度', label: '可用額度', sortable: true, checkboxIndex: 5, render: (user) => `<td class="cell-val" data-col="availableCredit">${user.availableCredit}</td>` },
        { id: 'commissionBal', group: '信用 & 額度', label: '佣金餘額', sortable: true, checkboxIndex: 5, render: (user) => `<td class="cell-money ${user.commissionBal > 0 ? 'positive' : ''}" data-col="commissionBal">${user.commissionBal > 0 ? user.commissionBal : '0'}</td>` },
        { id: 'balanceBuy', group: '信用 & 額度', label: '餘額買', sortable: true, checkboxIndex: 5, render: (user) => `<td class="cell-money ${user.balanceBuy > 0 ? 'highlight' : ''}" data-col="balanceBuy">${user.balanceBuy > 0 ? user.balanceBuy : '0'}</td>` },
        { id: 'arrears', group: '信用 & 額度', label: '欠款', sortable: true, checkboxIndex: 5, render: (user) => `<td class="cell-money ${user.arrears === '0' ? 'negative' : ''}" style="color:${user.arrears === '0' ? '#ef4444' : 'inherit'};" data-col="arrears">${renderDataState(user.arrears)}</td>` },
        { id: 'interest', group: '信用 & 額度', label: '餘額買利息', sortable: true, checkboxIndex: 5, render: (user) => `<td class="cell-val" data-col="interest">${user.interest}</td>` },
        { id: 'thirdBal', group: '信用 & 額度', label: '三方餘額', sortable: true, checkboxIndex: 5, render: (user) => `<td class="cell-val" data-col="thirdBal"><div style="display:flex;align-items:center;">${user.thirdBal > 0 ? user.thirdBal : '0'} <i class="ph ph-arrows-clockwise refresh-icon-compact" data-uid="${user.uid}" title="刷新餘額"></i></div></td>` },
        { id: 'points', group: '信用 & 額度', label: '會員積分', sortable: true, checkboxIndex: 5, render: (user) => `<td class="cell-val" data-col="points">${user.points}</td>` },
        { id: 'deposit', group: '存取款', label: '存款總額', sortable: true, checkboxIndex: 6, render: (user) => `<td class="cell-money ${user.deposit > 0 ? 'highlight' : ''}" data-col="deposit">${user.deposit > 0 ? user.deposit : '0'}</td>` },
        { id: 'withdraw', group: '存取款', label: '取款總額', sortable: true, checkboxIndex: 6, render: (user) => `<td class="cell-money" data-col="withdraw">${user.withdraw > 0 ? user.withdraw : '0'}</td>` },
        { id: 'withdrawPre', group: '存取款', label: '提款扣金額', sortable: true, checkboxIndex: 6, render: (user) => `<td class="cell-val" data-col="withdrawPre">${renderDataState(user.withdrawPre)}</td>` },
        { id: 'adminDeduct', group: '存取款', label: '後台扣款總額', sortable: true, checkboxIndex: 6, render: (user) => `<td class="cell-val" data-col="adminDeduct">${renderDataState(user.adminDeduct)}</td>` },
        { id: 'depositCount', group: '存取款', label: '存款次數', checkboxIndex: 6, render: (user) => `<td class="cell-val" data-col="depositCount">${user.depositCount}</td>` },
        { id: 'withdrawCount', group: '存取款', label: '取款次數', checkboxIndex: 6, render: (user) => `<td class="cell-val" data-col="withdrawCount">${user.withdrawCount}</td>` },
        { id: 'tags', group: '其他', label: '標籤', checkboxIndex: 7, render: (user) => {
            const tagStyles = {
                '正常': 'tag-blue',
                'VIP 客戶': 'tag-blue',
                'VIP': 'tag-blue',
                '活躍': 'tag-green',
                '高頻交易': 'tag-green',
                '大戶': 'tag-purple',
                '高消費': 'tag-purple',
                '異常風險': 'tag-red'
            };

            let riskIndicatorHtml = '';
            let visibleCount = user.tags.length;
            let showGradientMore = false;
            let showGrayMore = false;

            // Mock Scenarios based on uid for demonstration
            if (user.uid === "1239361225") {
                // Scenario 1
                riskIndicatorHtml = `
                    <div style="display: flex; align-items: center; gap: 8px; margin-right: 8px;">
                        <div class="tag-more-container">
                            <div style="width: 24px; height: 24px; background-color: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer;">
                                <i class="ph-fill ph-warning" style="color: #dc2626; font-size: 14px;"></i>
                                <div style="position: absolute; top: 0; right: 0; width: 6px; height: 6px; background-color: #dc2626; border-radius: 50%; border: 1px solid #fff;"></div>
                            </div>
                            <div class="tag-tooltip">
                                <span class="user-custom-tag tag-red"><i class="ph-fill ph-warning-circle" style="margin-right: 4px; font-size: 13px;"></i>異常風險</span>
                            </div>
                        </div>
                        <div style="width: 1px; height: 16px; background-color: #e2e8f0;"></div>
                    </div>
                `;
                visibleCount = 3;
                showGradientMore = true;
            } else if (user.uid === "1239361224") {
                // Scenario 2
                visibleCount = 2;
                showGrayMore = true;
            }

            let renderedTags = [];
            for (let i = 0; i < user.tags.length; i++) {
                if (i < visibleCount) {
                    renderedTags.push(user.tags[i]);
                } else if (!showGradientMore && !showGrayMore) {
                    renderedTags.push(user.tags[i]);
                }
            }
            
            let tagsOutput = renderedTags.map(tag => {
                let styleClass = tagStyles[tag] || 'tag-grey';
                if (tag === '異常風險') {
                    return `<span class="user-custom-tag ${styleClass}"><i class="ph-fill ph-warning-circle" style="margin-right: 4px; font-size: 13px;"></i>${tag}</span>`;
                }
                return `<span class="user-custom-tag ${styleClass}">${tag}</span>`;
            }).join('');

            let tooltipHtml = '';
            if (showGradientMore || showGrayMore) {
                let hiddenTagsHtml = user.tags.slice(visibleCount).map(tag => {
                    let styleClass = tagStyles[tag] || 'tag-grey';
                    if (tag === '異常風險') {
                        return `<span class="user-custom-tag ${styleClass}"><i class="ph-fill ph-warning-circle" style="margin-right: 4px; font-size: 13px;"></i>${tag}</span>`;
                    }
                    return `<span class="user-custom-tag ${styleClass}">${tag}</span>`;
                }).join('');
                tooltipHtml = `<div class="tag-tooltip">${hiddenTagsHtml}</div>`;
            }

            if (showGradientMore) {
                let fourthTag = user.tags[visibleCount] || '標籤...';
                let hiddenCount = user.tags.length - visibleCount;
                tagsOutput += `
                    <div class="tag-more-container" style="position: relative; display: flex; align-items: center; margin-left: 0px;">
                        <span class="user-custom-tag tag-grey" style="color: #cbd5e1; border-color: #f8fafc; padding-right: 20px;">${fourthTag}</span>
                        <div style="width: 32px; height: 100%; background: linear-gradient(to right, transparent, #fff 70%); position: absolute; left: 16px; top: 0; z-index: 1; pointer-events: none;"></div>
                        <span class="user-custom-tag" style="background-color: #fff; color: #2563eb; border: 1px solid #bfdbfe; font-weight: 500; position: absolute; right: 0; z-index: 2; padding: 2px 6px; margin-right: -4px;">+${hiddenCount}</span>
                        ${tooltipHtml}
                    </div>
                `;
            } else if (showGrayMore) {
                let hiddenCount = user.tags.length - visibleCount;
                tagsOutput += `<div class="tag-more-container"><span class="user-custom-tag tag-grey" style="padding: 2px 6px; font-weight: 500;">+${hiddenCount}</span>${tooltipHtml}</div>`;
            }

            return `<td data-col="tags">
                <div style="display:flex; align-items: center;">
                    ${riskIndicatorHtml}
                    <div style="display:flex; gap:4px; flex-wrap:${currentTableMode === 'compact' ? 'nowrap' : 'wrap'}; align-items: center;">
                        ${tagsOutput}
                    </div>
                </div>
            </td>`;
        } },

        { id: 'date', group: '日期信息', label: '新增時間', sortable: true, checkboxIndex: 9, render: (user) => `<td class="cell-val" data-col="date">${user.date}</td>` },
        { id: 'lastLogin', group: '日期信息', label: '最後登錄', sortable: true, checkboxIndex: 9, render: (user) => `<td class="cell-val" data-col="lastLogin">${user.lastLogin}</td>` },
        { id: 'offlineDays', group: '日期信息', label: '離開天數', sortable: true, checkboxIndex: 9, render: (user) => `<td class="cell-val" data-col="offlineDays">${user.offlineDays}</td>` },
        { id: 'ip', group: '日期信息', label: '登錄IP', checkboxIndex: 9, render: (user) => `<td class="cell-val" data-col="ip"><div class="ip-row" style="display: flex; align-items: center; gap: 4px;">${renderDataState(user.ip, 'ip')}</div></td>` },
        { id: 'remark', group: '備註', label: '備註', checkboxIndex: 10, render: (user) => `<td class="cell-val" data-col="remark">${user.remark}</td>` },
        { id: 'followRemark', group: '備註', label: '回訪備註', checkboxIndex: 10, render: (user) => `<td class="cell-val" data-col="followRemark">${user.followRemark}</td>` },
        { id: 'note', group: '備註', label: '注', checkboxIndex: 10, render: (user) => `<td class="cell-val" data-col="note">${user.note}</td>` },
        { id: 'action', group: '操作', label: '操作', render: (user) => {
            return `<td class="sticky-col-right" data-col="action" style="overflow:visible;text-align:center;vertical-align:middle;">
                <div class="compact-action-container" style="display:inline-flex;align-items:center;justify-content:center;">
                    <i class="ph ph-dots-three compact-action-icon" style="cursor:pointer;padding:4px;font-size:24px;color:#6b7280;line-height:1;" onmouseover="this.style.color='#3b82f6'" onmouseout="this.style.color='#6b7280'"></i>
                </div>
            </td>`;
        } }
    ];
    compactColumnsConfig.forEach(col => { compactColumnVisibility[col.id] = true; });

    // Elements for Table Mode & Pagination
    const btnModeNested = document.getElementById('btnModeNested');
    const btnModeCompact = document.getElementById('btnModeCompact');
    const modeDescriptionText = document.getElementById('modeDescriptionText');
    const modeNoticeText = document.getElementById('modeNoticeText');
    const userTable = document.getElementById('userTable');
    const userTableHeader = document.getElementById('userTableHeader');
    
    const selectPageSize = document.getElementById('selectPageSize');
    const btnPrevPage = document.getElementById('btnPrevPage');
    const btnNextPage = document.getElementById('btnNextPage');
    const pageNumbersList = document.getElementById('pageNumbersList');
    const inputJumpPage = document.getElementById('inputJumpPage');

    // Handle Table Mode Toggle
    function setTableMode(mode) {
        currentTableMode = mode;
        if (mode === 'nested') {
            if (btnModeNested) btnModeNested.classList.add('active');
            if (btnModeCompact) btnModeCompact.classList.remove('active');
            if (modeDescriptionText) modeDescriptionText.textContent = '巢狀結構：分組整合屬性，減少表格欄位寬度';
            if (modeNoticeText) modeNoticeText.innerHTML = '<strong>巢狀模式</strong>：將欄位屬性垂直分組組合，畫面精簡展示。點擊切換為壓縮模式可展開所有獨立列進行橫向比對。';
            if (userTable) userTable.classList.remove('compact-mode-table');
        } else {
            if (btnModeCompact) btnModeCompact.classList.add('active');
            if (btnModeNested) btnModeNested.classList.remove('active');
            if (modeDescriptionText) modeDescriptionText.textContent = '壓縮結構：扁平化所有屬性，適合橫向數據比對';
            if (modeNoticeText) modeNoticeText.innerHTML = '<strong>壓縮模式</strong>：所有欄位變成獨立的列，標題只出現在最上方一次，數據按行排列，方便橫向比對，類似 Excel 的視圖。';
            if (userTable) userTable.classList.add('compact-mode-table');
        }
        currentPage = 1;
        renderTable();
    }

    if (btnModeNested) btnModeNested.addEventListener('click', () => setTableMode('nested'));
    if (btnModeCompact) btnModeCompact.addEventListener('click', () => setTableMode('compact'));

    // Handle Page Size Change
    if (selectPageSize) {
        selectPageSize.addEventListener('change', (e) => {
            pageSize = parseInt(e.target.value, 10);
            currentPage = 1;
            renderTable();
        });
    }

    // Handle Prev / Next Page Click
    if (btnPrevPage) {
        btnPrevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
    }

    if (btnNextPage) {
        btnNextPage.addEventListener('click', () => {
            currentPage++;
            renderTable();
        });
    }

    // Handle Jump Page Input
    if (inputJumpPage) {
        inputJumpPage.addEventListener('change', (e) => {
            let val = parseInt(e.target.value, 10);
            if (isNaN(val) || val < 1) val = 1;
            currentPage = val;
            renderTable();
        });
        inputJumpPage.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) val = 1;
                currentPage = val;
                renderTable();
            }
        });
    }

    // Comprehensive Mock Users Database (50 Users for pagination demonstration)
    const baseMockUsers = [
        { uid: "1239361225", account: "mingv0717001", realName: "-", nickname: "mi***01", agentId: "dl", inviter: "-", registerMode: "一般註冊", phone: "末綁定", payLevel: "默認層", growth: 0, level: "普通會員", accountType: "普通帳號", userType: "代理會員", inviteCode: "-", directTeam: "0/0", vipLevel: 0, vipGrowth: 0, creditValue: 0, availableCredit: 0, commissionBal: 0, balanceBuy: 0, arrears: "-", interest: 0, thirdBal: 0, points: 0, deposit: 0, withdraw: 0, withdrawPre: "-", adminDeduct: "-", depositCount: 0, withdrawCount: 0, tags: ["VIP 客戶", "高頻交易", "大戶", "標籤四", "標籤五", "標籤六"], status: "冻结", date: "2023-01-01 12:00:00", lastLogin: "2023-01-10 15:30:00", offlineDays: 9, ip: "192.168.1.1", remark: "-", followRemark: "-", note: "-" },
        { uid: "1239361224", account: "albertvn021", realName: "-", nickname: "al***21", agentId: "nnest123556", inviter: "nnest123556", registerMode: "一般註冊", phone: "未驗證", payLevel: "默認層", growth: 0, level: "普通會員", accountType: "普通帳號", userType: "代理會員", inviteCode: "06077790", directTeam: "0/0", vipLevel: 0, vipGrowth: 0, creditValue: 0, availableCredit: 0, commissionBal: 0, balanceBuy: 0, arrears: "-", interest: 0, thirdBal: 0, points: 0, deposit: 0, withdraw: 0, withdrawPre: "-", adminDeduct: "-", depositCount: 0, withdrawCount: 0, tags: ["異常風險", "VIP 客戶", "標籤三", "標籤四", "標籤五"], status: "停用", date: "2023-01-02 10:00:00", lastLogin: "2023-01-11 09:20:00", offlineDays: 9, ip: "192.168.1.2", remark: "-", followRemark: "-", note: "-" },
        { uid: "1239361223", account: "vip_king", realName: "李娜", nickname: "鄭姐", agentId: "AG888", inviter: "nnest123556", registerMode: "一般註冊", phone: "13812348888", payLevel: "默認層", growth: 1250, level: "鑽石會員", accountType: "普通帳號", userType: "代理會員", inviteCode: "INV02", directTeam: "12/8", vipLevel: 3, vipGrowth: 6800, creditValue: 500, availableCredit: 2000, commissionBal: 680, balanceBuy: 8750, arrears: "0", interest: 120, thirdBal: 320, points: 450, deposit: 3200, withdraw: 1500, withdrawPre: "-", adminDeduct: "-", depositCount: 8, withdrawCount: 4, tags: ["正常", "活躍", "高消費", "標籤四", "標籤五"], status: "冻结", date: "2023-01-05 14:15:00", lastLogin: "2023-01-15 18:45:00", offlineDays: 0, ip: "192.168.1.3", remark: "-", followRemark: "-", note: "-" },
        { uid: "1239361226", account: "test_user_1", realName: "無權限", nickname: "無權限", agentId: "dl", inviter: "nnest123556", registerMode: "後台新增", phone: "無權限", payLevel: "默認層", growth: 0, level: "普通會員", accountType: "普通帳號", userType: "代理會員", inviteCode: "CODE100", directTeam: "0/0", vipLevel: 0, vipGrowth: 0, creditValue: 500, availableCredit: 0, commissionBal: 0, balanceBuy: 0, arrears: "0", interest: 0, thirdBal: 150, points: 0, deposit: 0, withdraw: 0, withdrawPre: "-", adminDeduct: "-", depositCount: 0, withdrawCount: 0, tags: ["新註冊"], status: "停用", date: "2023-02-01 10:00:00", lastLogin: "2023-03-01 15:30:00", offlineDays: 30, ip: "192.168.2.10", remark: "大戶需關注", followRemark: "-", note: "-" },
        { uid: "1239361227", account: "無權限", realName: "無權限", nickname: "無權限", agentId: "AG888", inviter: "-", registerMode: "一般註冊", phone: "無權限", payLevel: "默認層", growth: 150, level: "普通會員", accountType: "普通帳號", userType: "代理會員", inviteCode: "-", directTeam: "1/1", vipLevel: 1, vipGrowth: 50, creditValue: 0, availableCredit: 1000, commissionBal: 15, balanceBuy: 300, arrears: "0", interest: 2, thirdBal: 0, points: 25, deposit: 2000, withdraw: 500, withdrawPre: "-", adminDeduct: "-", depositCount: 1, withdrawCount: 1, tags: ["新註冊"], status: "停用", date: "2023-02-02 10:00:00", lastLogin: "2023-03-02 15:30:00", offlineDays: 1, ip: "無權限", remark: "-", followRemark: "-", note: "-" },
        { uid: "1239361228", account: "test_user_3", realName: "-", nickname: "tu***02", agentId: "nnest123556", inviter: "nnest123556", registerMode: "一般註冊", phone: "13912341002", payLevel: "默認層", growth: 300, level: "普通會員", accountType: "普通帳號", userType: "代理會員", inviteCode: "CODE102", directTeam: "2/2", vipLevel: 2, vipGrowth: 100, creditValue: 500, availableCredit: 2000, commissionBal: 30, balanceBuy: 600, arrears: "0", interest: 4, thirdBal: 0, points: 50, deposit: 4000, withdraw: 1000, withdrawPre: "-", adminDeduct: "-", depositCount: 2, withdrawCount: 2, tags: ["新註冊"], status: "冻结", date: "NaN-NaN-NaN", lastLogin: "2023-03-03 15:30:00", offlineDays: 2, ip: "192.168.2.12", remark: "-", followRemark: "-", note: "-" },
        { uid: "1239361229", account: "test_user_4", realName: "陳大文", nickname: "tu***03", agentId: "dl", inviter: "-", registerMode: "一般註冊", phone: "未綁定", payLevel: "默認層", growth: 450, level: "普通會員", accountType: "普通帳號", userType: "代理會員", inviteCode: "-", directTeam: "3/0", vipLevel: 3, vipGrowth: 150, creditValue: 0, availableCredit: 3000, commissionBal: 45, balanceBuy: 900, arrears: "0", interest: 6, thirdBal: 0, points: 75, deposit: 6000, withdraw: 1500, withdrawPre: "-", adminDeduct: "-", depositCount: 3, withdrawCount: 3, tags: ["新註冊"], status: "冻结", date: "2023-02-04 10:00:00", lastLogin: "2023-03-04 15:30:00", offlineDays: 3, ip: "192.168.2.13", remark: "這是一段非常長非常長非常長的備註，用來測試單行截斷與懸停提示的效果是否正常運作。", followRemark: "-", note: "-" },
        { uid: "1239361230", account: "test_user_5", realName: "-", nickname: "tu***04", agentId: "AG888", inviter: "nnest123556", registerMode: "後台新增", phone: "13912341004", payLevel: "默認層", growth: 600, level: "普通會員", accountType: "普通帳號", userType: "代理會員", inviteCode: "CODE104", directTeam: "4/1", vipLevel: 0, vipGrowth: 200, creditValue: 500, availableCredit: 4000, commissionBal: 60, balanceBuy: 1200, arrears: "0", interest: 8, thirdBal: 150, points: 100, deposit: 8000, withdraw: 2000, withdrawPre: "-", adminDeduct: "獲取失敗", depositCount: 4, withdrawCount: 4, tags: ["新註冊"], status: "冻结", date: "2023-02-05 10:00:00", lastLogin: "2023-03-05 15:30:00", offlineDays: 4, ip: "192.168.2.14", remark: "-", followRemark: "-", note: "-" },
        { uid: "1239361231", account: "test_user_6", realName: "無權限", nickname: "tu***05", agentId: "無權限", inviter: "-", registerMode: "一般註冊", phone: "無權限", payLevel: "默認層", growth: 750, level: "普通會員", accountType: "普通帳號", userType: "代理會員", inviteCode: "-", directTeam: "0/2", vipLevel: 1, vipGrowth: 250, creditValue: 0, availableCredit: 5000, commissionBal: 75, balanceBuy: 1500, arrears: "0", interest: 10, thirdBal: 0, points: 125, deposit: 10000, withdraw: 2500, withdrawPre: "-", adminDeduct: "-", depositCount: 5, withdrawCount: 5, tags: ["正常", "活躍"], status: "正常", date: "2023-02-06 10:00:00", lastLogin: "2023-03-06 15:30:00", offlineDays: 5, ip: "192.168.2.15", remark: "-", followRemark: "-", note: "-" },
        { uid: "1239361232", account: "test_user_7", realName: "陳大文", nickname: "tu***06", agentId: "dl", inviter: "nnest123556", registerMode: "一般註冊", phone: "13912341006", payLevel: "默認層", growth: 900, level: "普通會員", accountType: "普通帳號", userType: "代理會員", inviteCode: "CODE106", directTeam: "1/0", vipLevel: 2, vipGrowth: 300, creditValue: 500, availableCredit: 6000, commissionBal: 90, balanceBuy: 1800, arrears: "0", interest: 12, thirdBal: 0, points: 150, deposit: 12000, withdraw: 3000, withdrawPre: "載入中", adminDeduct: "載入中", depositCount: 6, withdrawCount: 0, tags: ["新註冊"], status: "冻结", date: "2023-02-07 10:00:00", lastLogin: "2023-03-07 15:30:00", offlineDays: 6, ip: "192.168.2.16", remark: "-", followRemark: "-", note: "-" }
    ];

    // Generate 200 items to ensure pagination works smoothly with up to 100 items per page
    const mockUsers = [];
    for (let i = 0; i < 20; i++) {
        baseMockUsers.forEach((user, index) => {
            const num = (i * 10) + index + 1;
            const newUid = (parseInt(user.uid, 10) + i * 100).toString();
            const newAccount = i === 0 ? user.account : `${user.account}_${i}`;
            
            // Dynamic ratio for tags
            let dynamicTags = [];
            let r = Math.random() * 100;
            if (i === 0) {
                // Keep the first 10 items exact to baseMockUsers to guarantee the initial page view has the exact ones
                dynamicTags = user.tags;
            } else {
                if (r < 75) {
                    dynamicTags = ["新註冊"];
                } else if (r < 90) {
                    dynamicTags = ["正常", "活躍"];
                } else if (r < 97) {
                    dynamicTags = ["大戶", "VIP 客戶"];
                } else {
                    dynamicTags = ["異常風險", "VIP 客戶"];
                }
            }

            mockUsers.push({
                ...user,
                uid: newUid,
                account: newAccount,
                tags: dynamicTags,
                offlineDays: (user.offlineDays + i) % 15,
                other: index % 2 === 0 ? "未充值玩家" : "測試帳號",
                vip: index % 3 === 0 ? "钻石会员" : index % 3 === 1 ? "黄金会员" : "白银会员",
                level: index % 3 === 0 ? "VIP會員" : index % 3 === 1 ? "黃金會員" : "普通會員"
            });
        });
    }

    // Helper: Get active selections from multi-select
    function getMultiSelectValues(element) {
        if (!element) return [];
        const values = [];
        element.querySelectorAll('.select-options li.selected').forEach(li => {
            values.push(li.getAttribute('data-value'));
        });
        return values;
    }

    // Helper: Reset single select UI to specific value
    function setSingleSelectValue(element, val, text) {
        const selectedValSpan = element.querySelector('.selected-val');
        const optionsList = element.querySelector('.select-options');
        
        optionsList.querySelectorAll('li').forEach(li => {
            if (li.getAttribute('data-value') === val) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
        selectedValSpan.textContent = text;
    }

    // Helper: Clear multi select choices
    function clearMultiSelectValue(element) {
        const selectedValSpan = element.querySelector('.selected-val');
        const optionsList = element.querySelector('.select-options');
        
        optionsList.querySelectorAll('li').forEach(li => {
            li.classList.remove('selected');
            const checkbox = li.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = false;
        });
        selectedValSpan.textContent = '請選擇';
    }

    // Read form values and update Tags & Badge count
    function updateFilters() {
        const tagsContainer = document.getElementById('filterTagsContainer');
        const inputAccount = document.getElementById('inputAccount');
        
        if (!tagsContainer) return;
        
        const tags = [];
        let advancedCount = 0;

        // 1. Status
        if (selectedStatusVal) {
            tags.push({ key: 'status', label: `狀態: ${selectedStatusVal}`, type: 'single-custom', element: dropdownStatus, defaultValue: '', defaultText: '所有', valueVarSetter: (v) => selectedStatusVal = v });
        }
        // 2. Level
        if (selectedLevelVal) {
            tags.push({ key: 'level', label: `層級: ${selectedLevelVal}`, type: 'single-custom', element: dropdownLevel, defaultValue: '', defaultText: '全部', valueVarSetter: (v) => selectedLevelVal = v });
        }
        // 3. VIP (Multiple Select)
        const selectedVips = getMultiSelectValues(dropdownVip);
        if (selectedVips.length > 0) {
            tags.push({ key: 'vip', label: `等級: ${selectedVips.join(', ')}`, type: 'multi-custom', element: dropdownVip });
        }
        // 4. Other
        const selectedOthers = getMultiSelectValues(dropdownOther);
        if (selectedOthers.length > 0) {
            tags.push({ key: 'other', label: `其他: ${selectedOthers.join(', ')}`, type: 'multi-custom', element: dropdownOther });
        }
        // 5. Account
        if (inputAccount && inputAccount.value.trim()) {
            let labelPrefix = '帳號';
            if (currentAccountType === 'exact') labelPrefix = '帳號(精確)';
            if (currentAccountType === 'fuzzy') labelPrefix = '帳號(模糊)';
            if (currentAccountType === 'multi') labelPrefix = '帳號(多筆)';
            
            tags.push({ key: 'account', label: `${labelPrefix}: ${inputAccount.value.trim()}`, type: 'input', element: inputAccount });
        }

        // 6. Dynamic Filters
        const dynamicFilters = document.querySelectorAll('.dynamic-filter-tag');
        dynamicFilters.forEach((filter, index) => {
            const input = filter.querySelector('.dynamic-filter-input');
            const labelEl = filter.querySelector('.dynamic-filter-label');
            const val = input.value.trim();
            if (val) {
                const clone = labelEl.cloneNode(true);
                const badge = clone.querySelector('.type-badge');
                if (badge) badge.remove();
                const labelText = clone.textContent.trim();
                
                tags.push({
                    key: 'dynamic_' + index,
                    label: `${labelText}: ${val}`,
                    type: 'dynamic',
                    element: filter,
                    clearFunc: () => filter.remove()
                });
            }
        });
        
        // 6. Test Accounts Toggle
        if (filterTestAccountsToggle && filterTestAccountsToggle.checked) {
            tags.push({ key: 'filterTestAccounts', label: `過濾測試賬號`, type: 'checkbox', element: filterTestAccountsToggle });
        }

        // Advanced filter fields
        if (selectBirthday.value) {
            tags.push({ key: 'birthday', label: `生日: ${selectBirthday.value}`, type: 'native-select', element: selectBirthday });
            advancedCount++;
        }
        if (inputDateStart.value || inputDateEnd.value) {
            const startStr = inputDateStart.value ? inputDateStart.value.replace('T', ' ') : '??';
            const endStr = inputDateEnd.value ? inputDateEnd.value.replace('T', ' ') : '??';
            tags.push({ 
                key: 'dateRange', 
                label: `時間: ${startStr} ~ ${endStr}`, 
                type: 'inputs',
                elements: [inputDateStart, inputDateEnd] 
            });
            advancedCount++;
        }
        if (inputQuickLogin.value.trim()) {
            tags.push({ key: 'quickLogin', label: `快速登入: ${inputQuickLogin.value.trim()}`, type: 'input', element: inputQuickLogin });
            advancedCount++;
        }
        if (inputUid.value.trim()) {
            tags.push({ key: 'uid', label: `UID: ${inputUid.value.trim()}`, type: 'input', element: inputUid });
            advancedCount++;
        }
        if (inputInviteCode.value.trim()) {
            tags.push({ key: 'inviteCode', label: `邀請碼: ${inputInviteCode.value.trim()}`, type: 'input', element: inputInviteCode });
            advancedCount++;
        }
        if (inputNickname.value.trim()) {
            tags.push({ key: 'nickname', label: `暱稱: ${inputNickname.value.trim()}`, type: 'input', element: inputNickname });
            advancedCount++;
        }
        if (inputRealName.value.trim()) {
            tags.push({ key: 'realName', label: `姓名: ${inputRealName.value.trim()}`, type: 'input', element: inputRealName });
            advancedCount++;
        }
        if (inputBankCard.value.trim()) {
            tags.push({ key: 'bankCard', label: `銀行卡末碼: *${inputBankCard.value.trim()}`, type: 'input', element: inputBankCard });
            advancedCount++;
        }
        if (inputOfflineDays.value.trim()) {
            tags.push({ key: 'offlineDays', label: `未登入天數 > ${inputOfflineDays.value.trim()}`, type: 'input', element: inputOfflineDays });
            advancedCount++;
        }
        if (inputIp.value.trim()) {
            tags.push({ key: 'ip', label: `IP: ${inputIp.value.trim()}`, type: 'input', element: inputIp });
            advancedCount++;
        }
        if (inputDeposit.value.trim()) {
            tags.push({ key: 'deposit', label: `存款 > $${inputDeposit.value.trim()}`, type: 'input', element: inputDeposit });
            advancedCount++;
        }

        // Outer fields processing
        if (selectedBirthdayOuterVal) {
            tags.push({ key: 'birthdayOuter', label: `生日: ${selectedBirthdayOuterVal}月`, type: 'single-custom', element: dropdownBirthdayOuter, defaultValue: '', defaultText: '全部', valueVarSetter: (v) => selectedBirthdayOuterVal = v });
        }
        if (inputDateStartOuter && inputDateEndOuter && (inputDateStartOuter.value || inputDateEndOuter.value)) {
            const startStr = inputDateStartOuter.value ? inputDateStartOuter.value.replace('T', ' ') : '??';
            const endStr = inputDateEndOuter.value ? inputDateEndOuter.value.replace('T', ' ') : '??';
            tags.push({ 
                key: 'dateRangeOuter', 
                label: `新增時間: ${startStr} ~ ${endStr}`, 
                type: 'inputs',
                elements: [inputDateStartOuter, inputDateEndOuter] 
            });
        }
        if (inputBankCardOuter && inputBankCardOuter.value.trim()) {
            tags.push({ key: 'bankCardOuter', label: `綁定銀行卡: ${inputBankCardOuter.value.trim()}`, type: 'input', element: inputBankCardOuter });
        }
        if (inputOfflineDaysOuter && inputOfflineDaysOuter.value.trim()) {
            tags.push({ key: 'offlineDaysOuter', label: `未登入天數 > ${inputOfflineDaysOuter.value.trim()}`, type: 'input', element: inputOfflineDaysOuter });
        }
        if (inputIpOuter && inputIpOuter.value.trim()) {
            tags.push({ key: 'ipOuter', label: `登入 IP: ${inputIpOuter.value.trim()}`, type: 'input', element: inputIpOuter });
        }
        if (inputDepositOuter && inputDepositOuter.value.trim()) {
            tags.push({ key: 'depositOuter', label: `存款大於 $${inputDepositOuter.value.trim()}`, type: 'input', element: inputDepositOuter });
        }

        // Render badge count
        advancedBadge.textContent = advancedCount;

        // Render tags
        filterTagsContainer.innerHTML = '';
        tags.forEach(tag => {
            const div = document.createElement('div');
            div.className = 'filter-tag';
            div.textContent = tag.label + ' ';
            
            const closeIcon = document.createElement('i');
            closeIcon.className = 'ph ph-x';
            closeIcon.addEventListener('click', () => {
                // Clear the target fields
                if (tag.type === 'single-custom') {
                    setSingleSelectValue(tag.element, tag.defaultValue, tag.defaultText);
                    tag.valueVarSetter(tag.defaultValue);
                } else if (tag.type === 'multi-custom') {
                    clearMultiSelectValue(tag.element);
                } else if (tag.type === 'inputs') {
                    tag.elements.forEach(el => el.value = '');
                } else if (tag.type === 'native-select') {
                    tag.element.value = '';
                } else if (tag.type === 'checkbox') {
                    tag.element.checked = false;
                } else {
                    tag.element.value = '';
                }
                currentPage = 1;
                updateFilters();
                renderTable();
            });
            
            div.appendChild(closeIcon);
            filterTagsContainer.appendChild(div);
        });
    }

    // Reset all filters
    function clearAllFilters() {
        setSingleSelectValue(dropdownStatus, '', '所有');
        selectedStatusVal = '';
        
        if (filterTestAccountsToggle) filterTestAccountsToggle.checked = false;
        
        setSingleSelectValue(dropdownLevel, '', '全部');
        selectedLevelVal = '';

        clearMultiSelectValue(dropdownVip);
        clearMultiSelectValue(dropdownOther);
        
        const inputAccount = document.getElementById('inputAccount');
        if (inputAccount) inputAccount.value = '';
        // Reset advanced
        selectBirthday.value = '';
        inputDateStart.value = '';
        inputDateEnd.value = '';
        inputQuickLogin.value = '';
        inputUid.value = '';
        inputInviteCode.value = '';
        inputNickname.value = '';
        inputRealName.value = '';
        inputBankCard.value = '';
        inputOfflineDays.value = '';
        inputIp.value = '';
        inputDeposit.value = '';

        // Reset outer fields
        if (dropdownBirthdayOuter) {
            setSingleSelectValue(dropdownBirthdayOuter, '', '全部');
            selectedBirthdayOuterVal = '';
        }
        if (inputDateStartOuter) inputDateStartOuter.value = '';
        if (inputDateEndOuter) inputDateEndOuter.value = '';
        if (inputBankCardOuter) inputBankCardOuter.value = '';
        if (inputOfflineDaysOuter) inputOfflineDaysOuter.value = '';
        if (inputIpOuter) inputIpOuter.value = '';
        if (inputDepositOuter) inputDepositOuter.value = '';

        currentPage = 1;
        updateFilters();
        renderTable();
    }

    if (btnClearAll) btnClearAll.addEventListener('click', clearAllFilters);
    if (btnReset) btnReset.addEventListener('click', clearAllFilters);
    if (btnClearDrawer) btnClearDrawer.addEventListener('click', () => {
        // Only clear advanced fields
        selectBirthday.value = '';
        inputDateStart.value = '';
        inputDateEnd.value = '';
        inputQuickLogin.value = '';
        inputUid.value = '';
        inputInviteCode.value = '';
        inputNickname.value = '';
        inputRealName.value = '';
        inputBankCard.value = '';
        inputOfflineDays.value = '';
        inputIp.value = '';
        inputDeposit.value = '';
        
        currentPage = 1;
        updateFilters();
        renderTable();
    });

    // Render Table Data & Headers
    function renderTable() {
        const selectedVips = getMultiSelectValues(dropdownVip);
        const selectedOthers = getMultiSelectValues(dropdownOther);
        const inputAccount = document.getElementById('inputAccount');
        const accountVal = inputAccount ? inputAccount.value.trim().toLowerCase() : '';

        // Advanced filter values
        const selectBirthdayOuter = document.getElementById('selectBirthdayOuter');
        const inputDateStartOuter = document.getElementById('inputDateStartOuter');
        const inputDateEndOuter = document.getElementById('inputDateEndOuter');
        const inputBankCardOuter = document.getElementById('inputBankCardOuter');
        const inputOfflineDaysOuter = document.getElementById('inputOfflineDaysOuter');
        const inputIpOuter = document.getElementById('inputIpOuter');
        const inputDepositOuter = document.getElementById('inputDepositOuter');

        const birthdayVal = selectBirthday.value || (selectBirthdayOuter ? selectBirthdayOuter.value : '');
        const dateStartVal = inputDateStart.value || (inputDateStartOuter ? inputDateStartOuter.value : '');
        const dateEndVal = inputDateEnd.value || (inputDateEndOuter ? inputDateEndOuter.value : '');
        const quickLoginVal = inputQuickLogin.value.trim();
        const uidVal = inputUid.value.trim();
        const inviteCodeVal = inputInviteCode.value.trim();
        const nicknameVal = inputNickname.value.trim().toLowerCase();
        const realNameVal = inputRealName.value.trim();
        const bankCardVal = inputBankCard.value.trim();
        const offlineDaysVal = parseInt(inputOfflineDays.value.trim(), 10);
        const ipVal = inputIp.value.trim();
        const depositVal = parseFloat(inputDeposit.value.trim());

        // Perform Filtering
        const filtered = mockUsers.filter(user => {
            if (selectedStatusVal && user.status !== selectedStatusVal) return false;
            if (selectedLevelVal && user.level !== selectedLevelVal) return false;
            if (selectedVips.length > 0 && !selectedVips.includes(user.vip)) return false;
            if (selectedOthers.length > 0 && !selectedOthers.includes(user.other)) return false;
            
            // Account filter
            if (accountVal) {
                if (currentAccountType === 'exact') {
                    if (user.account.toLowerCase() !== accountVal) return false;
                } else if (currentAccountType === 'fuzzy') {
                    if (!user.account.toLowerCase().includes(accountVal)) return false;
                } else if (currentAccountType === 'multi') {
                    const accounts = accountVal.split(';').map(a => a.trim()).filter(Boolean);
                    if (accounts.length > 0 && !accounts.some(acc => user.account.toLowerCase() === acc)) return false;
                } else if (currentAccountType === 'quickLogin') {
                    if (!user.quickLogin || !user.quickLogin.toLowerCase().includes(accountVal)) return false;
                } else if (currentAccountType === 'uid') {
                    if (!user.uid || !user.uid.toLowerCase().includes(accountVal)) return false;
                } else if (currentAccountType === 'inviteCode') {
                    if (!user.inviteCode || !user.inviteCode.toLowerCase().includes(accountVal)) return false;
                } else if (currentAccountType === 'nickname') {
                    if (!user.nickname || !user.nickname.toLowerCase().includes(accountVal)) return false;
                } else if (currentAccountType === 'realName') {
                    if (!user.realName || !user.realName.toLowerCase().includes(accountVal)) return false;
                } else {
                    if (user[currentAccountType] && !user[currentAccountType].toLowerCase().includes(accountVal)) return false;
                }
            }

            // Advanced Filters
            const formattedDateStart = dateStartVal ? dateStartVal.replace('T', ' ') : '';
            const formattedDateEnd = dateEndVal ? dateEndVal.replace('T', ' ') : '';
            if (birthdayVal && user.birthday !== birthdayVal) return false;
            if (formattedDateStart && user.date < formattedDateStart) return false;
            if (formattedDateEnd && user.date > formattedDateEnd) return false;
            if (quickLoginVal && user.quickLogin !== quickLoginVal) return false;
            if (uidVal && user.uid !== uidVal) return false;
            if (inviteCodeVal && user.inviteCode !== inviteCodeVal) return false;
            if (nicknameVal && !user.nickname.toLowerCase().includes(nicknameVal)) return false;
            if (realNameVal && !user.realName.includes(realNameVal)) return false;
            if (bankCardVal && !user.bankCard.includes(bankCardVal)) return false;
            if (!isNaN(offlineDaysVal) && user.offlineDays <= offlineDaysVal) return false;
            if (ipVal && !user.ip.includes(ipVal)) return false;
            if (!isNaN(depositVal) && user.deposit <= depositVal) return false;

            return true;
        });

        // Sorting Logic
        if (currentSortColumn) {
            filtered.sort((a, b) => {
                let valA = a[currentSortColumn];
                let valB = b[currentSortColumn];
                
                // Handle numeric conversion for arrears (e.g. "-" or numbers)
                if (currentSortColumn === 'arrears') {
                    valA = valA === '-' ? 0 : parseFloat(valA) || 0;
                    valB = valB === '-' ? 0 : parseFloat(valB) || 0;
                } else if (typeof valA === 'string' && typeof valB === 'string') {
                    // Try to parse as numbers if possible
                    const numA = parseFloat(valA);
                    const numB = parseFloat(valB);
                    if (!isNaN(numA) && !isNaN(numB)) {
                        valA = numA;
                        valB = numB;
                    }
                }

                if (valA < valB) return currentSortDirection === 'asc' ? -1 : 1;
                if (valA > valB) return currentSortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Calculate Pagination Slicing
        const totalCount = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalCount);
        const pagedUsers = filtered.slice(startIndex, endIndex);

        // Update Total Count & Pagination Controls
        const totalCountSpan = document.getElementById('totalCount');
        if (totalCountSpan) totalCountSpan.textContent = totalCount;

        if (btnPrevPage) btnPrevPage.disabled = (currentPage === 1);
        if (btnNextPage) btnNextPage.disabled = (currentPage === totalPages || totalPages === 0);
        if (inputJumpPage) {
            inputJumpPage.value = currentPage;
            inputJumpPage.max = totalPages;
        }

        // Render Page Numbers (Compact mode)
        if (pageNumbersList) {
            pageNumbersList.textContent = `${currentPage} / ${totalPages}`;
        }

        // Helper for Sort Icons
        function getSortBtn(col) {
            const isActive = currentSortColumn === col;
            const isAsc = isActive && currentSortDirection === 'asc';
            const isDesc = isActive && currentSortDirection === 'desc';
            return `<button type="button" class="sort-btn ${isAsc ? 'active-asc' : ''} ${isDesc ? 'active-desc' : ''}" data-sort="${col}">
                <i class="ph-fill ph-caret-${isDesc ? 'down' : 'up'}"></i>
            </button>`;
        }

        // Render Table Headers according to Table Mode
        if (userTableHeader) {
            if (currentTableMode === 'nested') {
                let nestedHeaderHtml = `<th width="40" style="text-align: center;"><input type="checkbox" id="selectAllCheckbox"></th>`;
                nestedColumnsConfig.forEach(col => {
                    if (nestedColumnVisibility[col.id]) {
                        nestedHeaderHtml += `<th>${col.label}</th>`;
                    }
                });
                nestedHeaderHtml += `<th style="text-align: center; width: 190px;">
                    <button type="button" class="btn-custom-columns-header btn-header-columns-toggle" title="自訂欄位">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <rect x="3" y="3" width="4" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
                            <rect x="9" y="3" width="4" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                    </button>
                </th>`;
                userTableHeader.innerHTML = `<tr class="header-group-row">${nestedHeaderHtml}</tr>`;
            } else {
                // Compact Mode: 2-tier Headers with dynamic groups and pinning
                const pinned = [];
                const unpinned = [];
                
                const visibleColumnsConfig = compactColumnsConfig.filter(col => compactColumnVisibility[col.id]);
                
                visibleColumnsConfig.forEach(col => {
                    if (pinnedColumnIds.includes(col.id)) {
                        pinned.push(col);
                    } else {
                        unpinned.push(col);
                    }
                });

                let groupRowHtml = `<th class="header-group sticky-col sticky-col-1" rowspan="2" width="40" style="left:0; z-index:12;"><input type="checkbox" id="selectAllCheckboxCompact"></th>`;
                let subRowHtml = ``;

                let currentLeft = 40; // Starts after checkbox

                // Pinned headers span both rows (rowspan="2")
                pinned.forEach(col => {
                    groupRowHtml += `<th class="header-group sticky-col" rowspan="2" style="left:${currentLeft}px; min-width:110px; z-index:12;" data-col="${col.id}">
                        <div style="display:flex;align-items:center;white-space:nowrap;justify-content:space-between;">
                            <div style="display:flex;align-items:center;">
                                <span>${col.label}</span>
                                ${col.sortable ? getSortBtn(col.id) : ''}
                            </div>
                            <i class="ph ph-push-pin icon-pin active" data-id="${col.id}" title="取消釘選"></i>
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
                            <button type="button" class="btn-custom-columns-header btn-header-columns-toggle" title="自訂欄位">
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
                                <span>${col.label}</span>
                                ${col.sortable ? getSortBtn(col.id) : ''}
                            </div>
                            <i class="ph ph-push-pin icon-pin" data-id="${col.id}" title="釘選欄位"></i>
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
                `;
            }
        }

        // Render Table Body
        // Render Table Body Loading State (Skeleton)
        let skeletonHtml = '';
        const skeletonRowsCount = Math.min(pageSize, 10);
        
        for (let i = 0; i < skeletonRowsCount; i++) {
            if (currentTableMode === 'nested') {
                skeletonHtml += `<tr>`;
                skeletonHtml += `<td style="text-align: center; padding: 16px 8px;"><div class="skeleton-box skeleton-text-short" style="height: 14px; margin: 0 auto; display: block; max-width: 20px;"></div></td>`;
                if (nestedColumnVisibility['online']) skeletonHtml += `<td style="padding: 16px 8px;"><div class="skeleton-box skeleton-text-short" style="margin:0 auto; display: block;"></div></td>`;
                if (nestedColumnVisibility['avatar']) skeletonHtml += `<td style="padding: 16px 8px;"><div class="skeleton-avatar"></div></td>`;
                if (nestedColumnVisibility['memberInfo']) skeletonHtml += `<td style="padding: 16px 8px;"><div class="skeleton-box skeleton-text-medium" style="margin-bottom:8px; display: block;"></div><div class="skeleton-box skeleton-text-long" style="display: block;"></div></td>`;
                if (nestedColumnVisibility['levelTeam']) skeletonHtml += `<td style="padding: 16px 8px;"><div class="skeleton-box skeleton-text-medium" style="margin-bottom:8px; display: block;"></div><div class="skeleton-box skeleton-text-long" style="display: block;"></div></td>`;
                if (nestedColumnVisibility['creditLimit']) skeletonHtml += `<td style="padding: 16px 8px;"><div class="skeleton-box skeleton-text-medium" style="margin-bottom:8px; display: block;"></div><div class="skeleton-box skeleton-text-long" style="display: block;"></div></td>`;
                if (nestedColumnVisibility['depositWithdraw']) skeletonHtml += `<td style="padding: 16px 8px;"><div class="skeleton-box skeleton-text-medium" style="margin-bottom:8px; display: block;"></div><div class="skeleton-box skeleton-text-long" style="display: block;"></div></td>`;
                if (nestedColumnVisibility['tags']) skeletonHtml += `<td style="padding: 16px 8px;"><div class="skeleton-box skeleton-text-medium" style="display: block;"></div></td>`;
                if (nestedColumnVisibility['status']) skeletonHtml += `<td style="padding: 16px 8px;"><div class="skeleton-box skeleton-text-short" style="display: block;"></div></td>`;
                if (nestedColumnVisibility['dateInfo']) skeletonHtml += `<td style="padding: 16px 8px;"><div class="skeleton-box skeleton-text-medium" style="margin-bottom:8px; display: block;"></div><div class="skeleton-box skeleton-text-long" style="display: block;"></div></td>`;
                if (nestedColumnVisibility['remark']) skeletonHtml += `<td style="padding: 16px 8px;"><div class="skeleton-box skeleton-text-medium" style="margin-bottom:8px; display: block;"></div><div class="skeleton-box skeleton-text-long" style="display: block;"></div></td>`;
                skeletonHtml += `<td style="padding: 16px 8px;"><div class="skeleton-box skeleton-text-medium" style="margin-bottom:8px; margin: 0 auto; display: block;"></div><div class="skeleton-box skeleton-text-short" style="margin: 0 auto; display: block;"></div></td>`;
                skeletonHtml += `</tr>`;
            } else {
                skeletonHtml += `<tr>`;
                const visibleColumnsConfig = compactColumnsConfig.filter(col => compactColumnVisibility[col.id]);
                skeletonHtml += `<td class="sticky-col sticky-col-1" style="left:0; padding: 16px 8px;"><div class="skeleton-box skeleton-text-short" style="height: 14px; margin: 0 auto; display: block; max-width: 20px;"></div></td>`;
                let currentLeft = 40;
                
                visibleColumnsConfig.forEach((col, idx) => {
                     let w = (idx % 2 === 0) ? 'skeleton-text-medium' : 'skeleton-text-long';
                     let isPinned = pinnedColumnIds.includes(col.id);
                     if (isPinned) {
                         skeletonHtml += `<td class="sticky-col" style="left:${currentLeft}px; min-width:110px; padding: 16px 8px;"><div class="skeleton-box ${w}" style="display: block;"></div></td>`;
                         currentLeft += 110;
                     } else {
                         skeletonHtml += `<td style="padding: 16px 8px;"><div class="skeleton-box ${w}" style="display: block;"></div></td>`;
                     }
                });
                skeletonHtml += `</tr>`;
            }
        }
        userTableBody.innerHTML = skeletonHtml;

        if (window.renderTableTimeout) clearTimeout(window.renderTableTimeout);
        window.renderTableTimeout = setTimeout(() => {
            userTableBody.innerHTML = '';
            if (pagedUsers.length === 0) {
                userTableBody.innerHTML = `<tr><td colspan="${colspanForLoading}" style="text-align: center; color: var(--text-muted); padding: 32px 0;">無符合篩選條件的會員資料</td></tr>`;
                applyColumnVisibility();
                return;
            }

            pagedUsers.forEach(user => {
            const tr = document.createElement('tr');
            
            let rowClass = '';
            if (user.tags && user.tags.includes('異常風險')) {
                rowClass = 'row-danger';
            } else if (user.tags && (user.tags.includes('VIP 客戶') || user.tags.includes('大戶'))) {
                rowClass = 'row-warning';
            } else if (user.tags && (user.tags.includes('活躍') || user.tags.includes('正常'))) {
                rowClass = 'row-success';
            }
            if (rowClass) {
                tr.classList.add(rowClass);
            }

            if (currentTableMode === 'nested') {
                // Nested Mode Layout
                let nestedRowHtml = `<td style="text-align: center;"><input type="checkbox" class="user-checkbox"></td>`;

                if (nestedColumnVisibility['online']) {
                    nestedRowHtml += `<td style="text-align: center;">
                        <span class="user-custom-tag ${user.offlineDays === 0 ? 'tag-yellow' : 'tag-grey'}">${user.offlineDays === 0 ? '在線' : '離線'}</span>
                    </td>`;
                }
                if (nestedColumnVisibility['avatar']) {
                    nestedRowHtml += `<td style="text-align: center;">
                        <div class="user-avatar-circle-grey">
                            <i class="ph-fill ph-user"></i>
                        </div>
                    </td>`;
                }
                if (nestedColumnVisibility['memberInfo']) {
                    nestedRowHtml += `<td class="nested-cell-info">
                        <div><span class="info-label">用戶ID :</span> ${renderDataState(user.uid, 'copyable')}</div>
                        <div><span class="info-label">會員名 :</span> <a href="#" class="user-detail-link" data-uid="${user.uid}">${renderDataState(user.account, 'copyable')}</a></div>
                        <div><span class="info-label">真實姓名 :</span> ${renderDataState(user.realName)}</div>
                        <div><span class="info-label">用戶暱稱 :</span> ${renderDataState(user.nickname)}</div>
                        <div><span class="info-label">代理 :</span> ${renderDataState(user.agentId)}</div>
                        <div><span class="info-label">邀請人 :</span> ${renderDataState(user.inviter)}</div>
                        <div><span class="info-label">註冊模式 :</span> ${user.registerMode || '一般註冊'}</div>
                        <div><span class="info-label">手機號 :</span> ${renderDataState(user.phone, 'phone')}</div>
                    </td>`;
                }
                if (nestedColumnVisibility['levelTeam']) {
                    nestedRowHtml += `<td class="nested-cell-info">
                        <div><span class="info-label">支付層級 :</span> ${user.payLevel || '默認層'}</div>
                        <div><span class="info-label">成長值 :</span> ${user.growth || 0}</div>
                        <div><span class="info-label">等級 :</span> <strong class="${user.level === '黃金會員' ? 'level-gold' : ''}">${user.level}</strong></div>
                        <div><span class="info-label">帳號類型 :</span> ${user.accountType || '普通帳號'}</div>
                        <div><span class="info-label">會員類型 :</span> ${user.userType || '代理會員'}</div>
                        <div><span class="info-label">邀請碼 :</span> ${user.inviteCode || '-'}</div>
                        <div><span class="info-label">直屬下級/團隊人數 :</span> ${user.directTeam || '0/0'}</div>
                        <div><span class="info-label">VIP會員等級 :</span> ${user.vipLevel || 0}</div>
                        <div><span class="info-label">VIP成長值 :</span> ${user.vipGrowth || 0}</div>
                    </td>`;
                }
                if (nestedColumnVisibility['creditLimit']) {
                    nestedRowHtml += `<td class="nested-cell-info">
                        <div><span class="info-label">信用值 :</span> ${user.creditValue || 0}</div>
                        <div><span class="info-label">可用額度 :</span> ${user.availableCredit || 0}</div>
                        <div><span class="info-label">佣金餘額 :</span> ${user.commissionBal || 0}</div>
                        <div><span class="info-label">診額寶 :</span> ${user.balanceBuy || 0}</div>
                        <div><span class="info-label">欠款 :</span> ${user.arrears || '-'}</div>
                        <div><span class="info-label">餘額寶利息 :</span> ${user.interest || 0}</div>
                        <div><span class="info-label">三方餘額 :</span> ${user.thirdBal || 0} <a href="#" class="refresh-link" style="color:#2563eb;font-size:12px;margin-left:4px;text-decoration:none;">刷新</a></div>
                        <div><span class="info-label">會員積分 :</span> ${user.points || 0}</div>
                    </td>`;
                }
                if (nestedColumnVisibility['depositWithdraw']) {
                    nestedRowHtml += `<td class="nested-cell-info">
                        <div><span class="info-label">存款總額 :</span> ${user.deposit || 0}</div>
                        <div><span class="info-label">取款總額 :</span> ${user.withdraw || 0}</div>
                        <div><span class="info-label">提款預扣金額 :</span> ${user.withdrawPre || '-'}</div>
                        <div><span class="info-label">后台扣款總額 :</span> ${user.adminDeduct || '-'}</div>
                        <div><span class="info-label">存款次數 :</span> ${user.depositCount || 0}</div>
                        <div><span class="info-label">取款次數 :</span> ${user.withdrawCount || 0}</div>
                    </td>`;
                }
                if (nestedColumnVisibility['tags']) {
                    const tagStyles = { '正常': 'tag-blue', 'VIP 客戶': 'tag-blue', 'VIP': 'tag-blue', '活躍': 'tag-green', '高頻交易': 'tag-green', '大戶': 'tag-purple', '高消費': 'tag-purple', '異常風險': 'tag-red' };
                    let nestedTagsOutput = user.tags.map(tag => {
                        let styleClass = tagStyles[tag] || 'tag-grey';
                        if (tag === '異常風險') {
                            return `<span class="user-custom-tag ${styleClass}"><i class="ph-fill ph-warning-circle" style="margin-right: 4px; font-size: 13px;"></i>${tag}</span>`;
                        }
                        return `<span class="user-custom-tag ${styleClass}">${tag}</span>`;
                    }).join('');
                    
                    nestedRowHtml += `<td>
                        <div class="user-tags-container" style="flex-wrap: wrap;">
                            ${nestedTagsOutput}
                        </div>
                    </td>`;
                }
                if (nestedColumnVisibility['status']) {
                    nestedRowHtml += `<td>
                        <span class="user-custom-tag ${user.status === '正常' ? 'tag-blue' : user.status === '冻结' ? 'tag-blue' : 'tag-red'}">${user.status}</span>
                    </td>`;
                }
                if (nestedColumnVisibility['dateInfo']) {
                    nestedRowHtml += `<td class="nested-cell-info">
                        <div><span class="info-label">新增時間 :</span> ${renderDataState(user.date)}</div>
                        <div><span class="info-label">最後登錄 :</span> ${renderDataState(user.lastLogin)}</div>
                        <div><span class="info-label">離開天數 :</span> ${user.offlineDays}天</div>
                        <div><span class="info-label">登錄IP :</span></div>
                        <div class="ip-row" style="display: flex; align-items: center; gap: 4px;">
                            ${renderDataState(user.ip, 'ip')}
                        </div>
                    </td>`;
                }
                if (nestedColumnVisibility['remark']) {
                    nestedRowHtml += `<td class="nested-cell-info">
                        <div><span class="info-label">備註 :</span> ${renderDataState(user.remark, 'longText')}</div>
                        <div><span class="info-label">回訪備註 :</span> ${renderDataState(user.followRemark, 'longText')}</div>
                        <div><span class="info-label">注 :</span> ${renderDataState(user.note, 'longText')}</div>
                    </td>`;
                }

                nestedRowHtml += `<td style="text-align: center; padding: 12px 8px;">
                    <div class="operations-grid-3x3">
                        <a href="#" class="op-link user-detail-link" data-uid="${user.uid}">編輯用戶</a>
                        <a href="#" class="op-link user-detail-link" data-uid="${user.uid}">查看詳情</a>
                        <a href="#" class="op-link">額度修改</a>
                        <a href="#" class="op-link">資金明細</a>
                        <a href="#" class="op-link">注單明細</a>
                        <a href="#" class="op-link">修改密碼</a>
                        <a href="#" class="op-link">下級會員</a>
                        <a href="#" class="op-link">下級報表</a>
                        <a href="#" class="op-link">下級注單</a>
                    </div>
                    <div class="more-op-dropdown-container">
                        <button class="btn-more-op-wide">更多...</button>
                        <ul class="more-op-dropdown-menu">
                            <li>交易設定</li>
                            <li>赔率设置</li>
                            <li>积分修改</li>
                            <li>代理变更</li>
                            <li>第三方游戏</li>
                            <li>稽核记录</li>
                            <li>代理变更记录</li>
                            <li>回访备注</li>
                            <li>隐藏资金明细</li>
                            <li>快速登录变更</li>
                            <li>校验用户任务</li>
                            <li>谷歌验证码</li>
                            <li>链上地址</li>
                            <li>额度修改(链上充值)</li>
                            <li>编辑标签</li>
                            <li>用户标签编辑记录</li>
                        </ul>
                    </div>
                </td>`;
                tr.innerHTML = nestedRowHtml;
            } else {
                // Compact Mode Layout
                const pinned = [];
                const unpinned = [];
                
                const visibleColumnsConfig = compactColumnsConfig.filter(col => compactColumnVisibility[col.id]);
                visibleColumnsConfig.forEach(col => {
                    if (pinnedColumnIds.includes(col.id)) pinned.push(col);
                    else unpinned.push(col);
                });

                let cellsHtml = `<td class="sticky-col sticky-col-1" style="left:0;"><input type="checkbox" class="user-checkbox"></td>`;
                
                let currentLeft = 40;
                pinned.forEach(col => {
                    let cellStr = col.render(user);
                    const match = cellStr.match(/^<td([^>]*?)class="([^"]*)"/);
                    if (match) {
                        cellStr = cellStr.replace(/^<td([^>]*?)class="/, `<td$1style="left:${currentLeft}px; min-width:110px;" class="sticky-col `);
                    } else {
                        cellStr = cellStr.replace(/^<td/, `<td style="left:${currentLeft}px; min-width:110px;" class="sticky-col"`);
                    }
                    cellsHtml += cellStr;
                    currentLeft += 110;
                });

                const unpinnedWithoutAction = unpinned.filter(col => col.id !== 'action');
                unpinnedWithoutAction.forEach(col => {
                    cellsHtml += col.render(user);
                });

                const actionCol = visibleColumnsConfig.find(col => col.id === 'action');
                if (actionCol) {
                    cellsHtml += actionCol.render(user);
                }

                tr.innerHTML = cellsHtml;
            }

            userTableBody.appendChild(tr);
        });

        // Bind Header Columns Toggle Button (Image 2 Icon)
        document.querySelectorAll('.btn-header-columns-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeAllDropdowns();
                const columnsDrawer = document.getElementById('columnsDrawer');
                if (columnsDrawer) {
                    if (currentTableMode === 'nested') {
                        tempNestedColumnVisibility = { ...nestedColumnVisibility };
                        tempNestedPinnedColumnIds = [ ...nestedPinnedColumnIds ];
                    } else {
                        tempCompactColumnVisibility = { ...compactColumnVisibility };
                        tempPinnedColumnIds = [ ...pinnedColumnIds ];
                    }
                    renderDropdown();
                    columnsDrawer.classList.add('active');
                    if (overlay) overlay.classList.add('active');
                }
            });
        });

        // Bind Compact Mode Row Action Dropdown Events
        userTableBody.querySelectorAll('.btn-op-more').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const menu = btn.nextElementSibling;
                const isShow = menu.classList.contains('show');
                document.querySelectorAll('.op-dropdown-menu').forEach(m => m.classList.remove('show'));
                if (!isShow) {
                    menu.classList.add('show');
                }
            });
        });

        userTableBody.querySelectorAll('.op-dropdown-menu li').forEach(li => {
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = li.textContent.trim();
                const tr = li.closest('tr');
                // find user account/id if needed
                const userCell = tr ? tr.querySelector('.user-detail-link') : null;
                const uid = userCell ? userCell.getAttribute('data-uid') : null;
                
                if (text === '查看詳情' || text === '編輯用戶') {
                    if (uid) openUserEditModal(uid);
                } else {
                    alert(`觸發操作：${text}`);
                }
                li.parentElement.classList.remove('show');
            });
        });

        userTableBody.querySelectorAll('.more-op-dropdown-menu li').forEach(li => {
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = li.textContent.trim();
                alert(`觸發操作：${text}`);
            });
        });
        
        // Bind Sort Events
        if (userTableHeader) {
            userTableHeader.querySelectorAll('.sort-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const col = btn.getAttribute('data-sort');
                    if (currentSortColumn === col) {
                        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        currentSortColumn = col;
                        currentSortDirection = 'desc';
                    }
                    renderTable();
                });
            });

            // Bind Pin Events
            userTableHeader.querySelectorAll('.icon-pin').forEach(icon => {
                icon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = icon.getAttribute('data-id');
                    if (pinnedColumnIds.includes(id)) {
                        pinnedColumnIds = pinnedColumnIds.filter(colId => colId !== id);
                    } else {
                        pinnedColumnIds.push(id);
                    }
                    renderTable();
                });
            });
        }

        // Apply column visibility
        applyColumnVisibility();
        }, 400);
    }


    // Column Visibility State
    const columnVisibility = {
        1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true
    };

    function applyColumnVisibility() {
        if (currentTableMode === 'compact') {
            const visibleCount = Object.values(compactColumnVisibility).filter(Boolean).length;
            const visibleColumnsCountSpan = document.getElementById('visibleColumnsCount');
            if (visibleColumnsCountSpan) {
                visibleColumnsCountSpan.textContent = visibleCount;
            }
            return;
        }

        Object.keys(columnVisibility).forEach(index => {
            const idx = parseInt(index, 10);
            const cells = document.querySelectorAll(`table tr th:nth-child(${idx + 1}), table tr td:nth-child(${idx + 1})`);
            cells.forEach(cell => {
                cell.style.display = columnVisibility[idx] ? '' : 'none';
            });
        });
        
        // Update visibility count footer
        const visibleCount = Object.values(columnVisibility).filter(Boolean).length;
        const visibleColumnsCountSpan = document.getElementById('visibleColumnsCount');
        if (visibleColumnsCountSpan) {
            visibleColumnsCountSpan.textContent = visibleCount;
        }
    }

    // Column Toggle Controls
    const btnColumnToggle = document.getElementById('btnColumnToggle');
    const columnToggleDropdown = document.getElementById('columnToggleDropdown');
    const columnSearchInput = document.getElementById('columnSearchInput');
    const columnList = document.getElementById('columnList');
    const resetColumns = document.getElementById('resetColumns');

    function renderDropdown() {
        let html = '';
        let visibleCount = 0;
        
        if (currentTableMode === 'nested') {
            const allChecked = nestedColumnsConfig.every(col => tempNestedColumnVisibility[col.id]);
            const someChecked = nestedColumnsConfig.some(col => tempNestedColumnVisibility[col.id]);
            const groupCbHtml = `<input type="checkbox" class="group-cb-nested" ${allChecked ? 'checked' : ''} style="margin-right:8px;">`;
            
            html += `
                <div class="column-group-header" style="display:flex; align-items:center; justify-content:space-between; margin: 16px 0 8px 0; padding-bottom: 4px; border-bottom: 1px solid var(--border-color); font-weight: bold;">
                    <label style="display:flex; align-items:center; cursor:pointer;">
                        ${groupCbHtml}
                        巢狀模式欄位
                    </label>
                </div>
            `;
            html += `<ul class="column-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">`;
            nestedColumnsConfig.forEach(col => {
                const isVisible = tempNestedColumnVisibility[col.id];
                if (isVisible) visibleCount++;
                const isPinned = tempNestedPinnedColumnIds.includes(col.id);
                
                const checkboxHtml = `<input type="checkbox" class="compact-col-cb" data-id="${col.id}" ${isVisible ? 'checked' : ''}>`;
                const labelSpanStyle = 'margin-left:8px; font-size:13px;';
                const pinHtml = `<i class="ph ph-push-pin icon-pin ${isPinned ? 'active' : ''}" data-id="${col.id}" title="釘選欄位"></i>`;

                html += `
                    <li>
                        <div class="dropdown-item-flex" style="padding-left: 8px; width: 100%;">
                            <label style="display:flex; align-items:center; flex-grow:1; margin-right:4px;">${checkboxHtml} <span style="${labelSpanStyle}">${col.label}</span></label>
                            ${pinHtml}
                        </div>
                    </li>
                `;
            });
            html += `</ul>`;

            const drawerContent = document.getElementById('columnsDrawerContent');
            if (drawerContent) {
                drawerContent.innerHTML = html;
                const groupCb = drawerContent.querySelector('.group-cb-nested');
                if (groupCb && !allChecked && someChecked) {
                    groupCb.indeterminate = true;
                }
            }
        } else {
            const groupedConfig = {};
            compactColumnsConfig.forEach(col => {
                if (!groupedConfig[col.group]) groupedConfig[col.group] = [];
                groupedConfig[col.group].push(col);
            });
            
            for (const [groupName, cols] of Object.entries(groupedConfig)) {
                const customizableCols = cols.filter(col => !['uid', 'account', 'action'].includes(col.id));
                const allChecked = customizableCols.length > 0 && customizableCols.every(col => tempCompactColumnVisibility[col.id]);
                const someChecked = customizableCols.some(col => tempCompactColumnVisibility[col.id]);
                
                let groupCbHtml = '';
                if (customizableCols.length > 0) {
                    groupCbHtml = `<input type="checkbox" class="group-cb" data-group="${groupName}" ${allChecked ? 'checked' : ''} style="margin-right:8px;">`;
                }

                html += `
                    <div class="column-group-header" style="display:flex; align-items:center; justify-content:space-between; margin: 16px 0 8px 0; padding-bottom: 4px; border-bottom: 1px solid var(--border-color); font-weight: bold;">
                        <label style="display:flex; align-items:center; ${customizableCols.length > 0 ? 'cursor:pointer;' : ''}">
                            ${groupCbHtml}
                            ${groupName}
                        </label>
                    </div>
                `;
                html += `<ul class="column-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">`;
                cols.forEach(col => {
                    const isVisible = tempCompactColumnVisibility[col.id];
                    if (isVisible) visibleCount++;
                    const isPinned = tempPinnedColumnIds.includes(col.id);
                    
                    let checkboxHtml = '';
                    let labelSpanStyle = 'margin-left:8px; font-size:13px;';
                    if (['uid', 'account', 'action'].includes(col.id)) {
                        checkboxHtml = `<input type="checkbox" class="compact-col-cb" data-id="${col.id}" data-group="${groupName}" checked style="display:none;">`;
                        labelSpanStyle = 'margin-left:0; font-size:13px; color: var(--text-secondary);';
                    } else {
                        checkboxHtml = `<input type="checkbox" class="compact-col-cb" data-id="${col.id}" data-group="${groupName}" ${isVisible ? 'checked' : ''}>`;
                    }
                    
                    let pinHtml = '';
                    if (col.id !== 'action') {
                        pinHtml = `<i class="ph ph-push-pin icon-pin ${isPinned ? 'active' : ''}" data-id="${col.id}" title="釘選欄位"></i>`;
                    }

                    html += `
                        <li>
                            <div class="dropdown-item-flex" style="padding-left: 8px; width: 100%;">
                                <label style="display:flex; align-items:center; flex-grow:1; margin-right:4px;">${checkboxHtml} <span style="${labelSpanStyle}">${col.label}</span></label>
                                ${pinHtml}
                            </div>
                        </li>
                    `;
                });
                html += `</ul>`;
            }

            const drawerContent = document.getElementById('columnsDrawerContent');
            if (drawerContent) {
                drawerContent.innerHTML = html;
                // Set indeterminate states
                drawerContent.querySelectorAll('.group-cb').forEach(groupCb => {
                    const groupName = groupCb.getAttribute('data-group');
                    const groupCols = groupedConfig[groupName];
                    const customizableCols = groupCols.filter(col => !['uid', 'account', 'action'].includes(col.id));
                    if (customizableCols.length > 0) {
                        const allChecked = customizableCols.every(col => tempCompactColumnVisibility[col.id]);
                        const someChecked = customizableCols.some(col => tempCompactColumnVisibility[col.id]);
                        if (!allChecked && someChecked) {
                            groupCb.indeterminate = true;
                        }
                    }
                });
            }
        }
    }

    // Toggle Dropdown (Nested / Compact Mode)
    if (btnColumnToggle) {
        btnColumnToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            
            if (currentTableMode === 'compact') {
                const columnsDrawer = document.getElementById('columnsDrawer');
                if (columnsDrawer) {
                    // Initialize temp draft state from saved state
                    tempCompactColumnVisibility = { ...compactColumnVisibility };
                    tempPinnedColumnIds = [ ...pinnedColumnIds ];
                    renderDropdown(); // Ensure it renders into the drawer first
                    columnsDrawer.classList.add('active');
                    document.getElementById('overlay').classList.add('active');
                }
            } else {
                const isOpen = columnToggleDropdown.classList.contains('show');
                if (!isOpen) {
                    renderDropdown();
                    columnToggleDropdown.classList.add('show');
                }
            }
        });
    }

    // Delegated Checkbox changed
    if (columnList) {
        columnList.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                if (currentTableMode === 'nested') {
                    const colIndex = parseInt(e.target.getAttribute('data-column'), 10);
                    columnVisibility[colIndex] = e.target.checked;
                    applyColumnVisibility();
                } else {
                    const colId = e.target.getAttribute('data-id');
                    compactColumnVisibility[colId] = e.target.checked;
                    renderTable();
                }
                renderDropdown(); // Update count
            }
        });

        // Delegated Pin Click inside dropdown
        columnList.addEventListener('click', (e) => {
            if (e.target.classList.contains('icon-pin')) {
                e.stopPropagation();
                const id = e.target.getAttribute('data-id');
                if (pinnedColumnIds.includes(id)) {
                    pinnedColumnIds = pinnedColumnIds.filter(colId => colId !== id);
                } else {
                    pinnedColumnIds.push(id);
                }
                renderDropdown(); // Update UI in dropdown
                renderTable(); // Update table
            }
        });
    }

    // Reset Defaults
    const resetAction = () => {
        if (currentTableMode === 'nested') {
            Object.keys(columnVisibility).forEach(k => columnVisibility[k] = true);
            applyColumnVisibility();
        } else {
            compactColumnsConfig.forEach(col => compactColumnVisibility[col.id] = true);
            pinnedColumnIds = [];
            renderTable();
        }
        renderDropdown();
    };
    if (resetColumns) resetColumns.addEventListener('click', resetAction);
    const resetIcon = document.querySelector('.reset-icon');
    if (resetIcon) resetIcon.addEventListener('click', resetAction);

    // Column List Search Filter
    if (columnSearchInput && columnList) {
        columnSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            columnList.querySelectorAll('li').forEach(li => {
                const text = li.querySelector('span').textContent.toLowerCase();
                if (text.includes(query)) {
                    li.style.display = '';
                } else {
                    li.style.display = 'none';
                }
            });
        });
    }

    // Select all logic via delegation
    if (userTableHeader) {
        userTableHeader.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && (e.target.id === 'selectAllCheckbox' || e.target.id === 'selectAllCheckboxCompact')) {
                const checkboxes = document.querySelectorAll('.user-checkbox');
                checkboxes.forEach(cb => cb.checked = e.target.checked);
            }
        });
    }

    // Search events
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            updateFilters();
            renderTable();
        });
    }
    if (btnApply) {
        btnApply.addEventListener('click', () => {
            updateFilters();
            renderTable();
            closeDrawer();
        });
    }

    // Sticky header with collapsible filter card logic
    const filterCard = document.querySelector('.filter-card');
    const tableWrapper = document.querySelector('.table-wrapper');
    
    if (tableWrapper && filterCard) {
        tableWrapper.addEventListener('scroll', () => {
            if (tableWrapper.scrollTop > 10) {
                filterCard.classList.add('collapsed');
            } else {
                filterCard.classList.remove('collapsed');
            }
        });
    }
    // Sidebar Group Collapse/Expand Toggles
    const navHeaders = document.querySelectorAll('.nav-item-header');
    navHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const group = header.parentElement;
            const arrow = header.querySelector('.toggle-arrow');
            
            // Toggle expanded class
            const isExpanded = group.classList.toggle('expanded');
            
            // Update arrow icon class
            if (arrow) {
                if (isExpanded) {
                    arrow.classList.remove('ph-caret-down');
                    arrow.classList.add('ph-caret-up');
                } else {
                    arrow.classList.remove('ph-caret-up');
                    arrow.classList.add('ph-caret-down');
                }
            }
        });
    });

    // Dynamic local time display
    const timeSpan = document.getElementById('currentLocalTime');
    if (timeSpan) {
        const updateTime = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            timeSpan.textContent = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Initialize UI
    setTableMode('nested');
    updateFilters();



    // Customize Filter Modal Logic
    const btnCustomizeFilter = document.getElementById('btnCustomizeFilter');
    const customizeFilterModal = document.getElementById('customizeFilterModal');
    const btnCustomizeFilterClose = document.getElementById('btnCustomizeFilterClose');
    const btnCustomizeFilterCancel = document.getElementById('btnCustomizeFilterCancel');
    const btnCustomizeFilterConfirm = document.getElementById('btnCustomizeFilterConfirm');
    
    if (btnCustomizeFilter && customizeFilterModal) {
        const openModal = () => customizeFilterModal.classList.add('show');
        const closeModal = () => customizeFilterModal.classList.remove('show');
        
        btnCustomizeFilter.addEventListener('click', openModal);
        btnCustomizeFilterClose.addEventListener('click', closeModal);
        btnCustomizeFilterCancel.addEventListener('click', closeModal);
        
        // Handle Confirm
        btnCustomizeFilterConfirm.addEventListener('click', () => {
            const checkboxes = customizeFilterModal.querySelectorAll('.checkbox-item input[type="checkbox"]');
            let allChecked = true;
            checkboxes.forEach(cb => {
                const filterId = cb.value;
                const isChecked = cb.checked;
                
                if (!isChecked) {
                    allChecked = false;
                }
                
                // Find all form groups and headers associated with this filter ID
                const elements = document.querySelectorAll(`[data-filter-id="${filterId}"]`);
                elements.forEach(el => {
                    if (isChecked) {
                        el.style.display = '';
                    } else {
                        el.style.display = 'none';
                    }
                });
            });
            
            const btnAdvanced = document.getElementById('openAdvancedFilter');
            if (btnAdvanced) {
                btnAdvanced.style.display = allChecked ? 'none' : '';
            }
            
            closeModal();
        });
        
        // Optional: Close modal on outside click
        customizeFilterModal.addEventListener('click', (e) => {
            if (e.target === customizeFilterModal) {
                closeModal();
            }
        });
    }

    // User Edit Modal Logic
    const userEditDrawer = document.getElementById('userEditDrawer');
    const btnUserEditClose = document.getElementById('btnUserEditClose');
    const btnUserEditCancel = document.getElementById('btnUserEditCancel');
    const btnUserEditSave = document.getElementById('btnUserEditSave');

    // Tab Switching inside Edit User Drawer
    document.querySelectorAll('.user-edit-tab-item').forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
            document.querySelectorAll('.user-edit-tab-item').forEach(b => b.classList.remove('active'));
            tabBtn.classList.add('active');
            const tabTarget = tabBtn.getAttribute('data-tab');
            const tabBasic = document.getElementById('tabContentBasic');
            const tabSettings = document.getElementById('tabContentSettings');
            if (tabTarget === 'basic') {
                if (tabBasic) tabBasic.style.display = 'block';
                if (tabSettings) tabSettings.style.display = 'none';
            } else {
                if (tabBasic) tabBasic.style.display = 'none';
                if (tabSettings) tabSettings.style.display = 'block';
            }
        });
    });

    function openUserEditModal(uid) {
        if (!userEditDrawer) return;
        const user = (mockUsers || []).find(u => u.uid === uid) || (mockUsers && mockUsers[0]);
        if (!user) return;

        const titleEl = document.getElementById('userEditDrawerTitle');
        if (titleEl) titleEl.textContent = `編輯用戶詳情 - ${user.account}`;
        
        const accountEl = document.getElementById('editFormAccount');
        if (accountEl) accountEl.textContent = user.account;
        
        const avatarEl = document.getElementById('modalUserAvatar');
        if (avatarEl) avatarEl.textContent = user.account.charAt(0).toLowerCase();

        // Radio selections
        const userTypeRadios = document.querySelectorAll('input[name="editUserType"]');
        userTypeRadios.forEach(r => r.checked = (r.value === user.userType));

        const statusRadios = document.querySelectorAll('input[name="editStatus"]');
        statusRadios.forEach(r => r.checked = (r.value === user.status));

        // Inputs
        const realNameIn = document.getElementById('editFormRealName');
        if (realNameIn) realNameIn.value = user.realName !== '-' ? user.realName : '';

        const nicknameIn = document.getElementById('editFormNickname');
        if (nicknameIn) nicknameIn.value = user.nickname !== '-' ? user.nickname : '';

        const phoneIn = document.getElementById('editFormPhone');
        if (phoneIn) phoneIn.value = (user.phone !== '未驗證' && user.phone !== '末綁定') ? user.phone : '';

        const payLevelSel = document.getElementById('editFormPayLevel');
        if (payLevelSel) payLevelSel.value = user.payLevel || '默認層';

        const levelSel = document.getElementById('editFormLevel');
        if (levelSel) levelSel.value = user.level || '普通會員';

        const remarkIn = document.getElementById('editFormRemark');
        if (remarkIn) remarkIn.value = user.remark !== '-' ? user.remark : '';

        // Reset to Basic Tab on open
        const basicTabBtn = document.querySelector('.user-edit-tab-item[data-tab="basic"]');
        if (basicTabBtn) basicTabBtn.click();

        userEditDrawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
    }

    function closeUserEditDrawer() {
        if (userEditDrawer) userEditDrawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    // Delegated click listener for user links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('.user-detail-link');
        if (link) {
            e.preventDefault();
            const uid = link.getAttribute('data-uid');
            openUserEditModal(uid);
        }
    });

    if (btnUserEditClose) btnUserEditClose.addEventListener('click', closeUserEditDrawer);
    if (btnUserEditCancel) btnUserEditCancel.addEventListener('click', closeUserEditDrawer);
    if (btnUserEditSave) {
        btnUserEditSave.addEventListener('click', () => {
            showToast('用戶詳情已更新！');
            closeUserEditDrawer();
        });
    }

// Toast Function
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '14px';
    toast.style.pointerEvents = 'none';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// IP Event Delegation
document.querySelector('#userTableBody')?.addEventListener('click', function(e) {
    if (e.target.closest('.ip-link')) {
        e.preventDefault();
        const ip = e.target.closest('.ip-link').dataset.ip;
        showToast('前往 IP 統計頁面: ' + ip);
    }
    
    if (e.target.closest('.copy-ip-btn')) {
        const ip = e.target.closest('.copy-ip-btn').dataset.ip;
        navigator.clipboard.writeText(ip).then(() => {
            showToast('已複製 IP: ' + ip);
        }).catch(err => {
            showToast('複製失敗');
        });
    }
    
    // Refresh third party balance in compact mode
    if (e.target.closest('.refresh-icon-compact')) {
        const icon = e.target.closest('.refresh-icon-compact');
        if (icon.classList.contains('icon-spin')) return; // Already refreshing
        
        icon.classList.add('icon-spin');
        
        // Simulate API call
        setTimeout(() => {
            icon.classList.remove('icon-spin');
            showToast('三方餘額刷新成功');
        }, 1000);
    }
});

const drawerContent = document.getElementById('columnsDrawerContent');
if (drawerContent) {
    drawerContent.addEventListener('change', (e) => {
        if (e.target.classList.contains('compact-col-cb')) {
            const colId = e.target.getAttribute('data-id');
            if (currentTableMode === 'nested') {
                tempNestedColumnVisibility[colId] = e.target.checked;
            } else {
                tempCompactColumnVisibility[colId] = e.target.checked;
            }
            renderDropdown(); // Update drawer UI only
        } else if (e.target.classList.contains('group-cb-nested')) {
            const isChecked = e.target.checked;
            nestedColumnsConfig.forEach(col => {
                tempNestedColumnVisibility[col.id] = isChecked;
            });
            renderDropdown();
        } else if (e.target.classList.contains('group-cb')) {
            const groupName = e.target.getAttribute('data-group');
            const isChecked = e.target.checked;
            compactColumnsConfig.forEach(col => {
                if (col.group === groupName && !['uid', 'account', 'action'].includes(col.id)) {
                    tempCompactColumnVisibility[col.id] = isChecked;
                }
            });
            renderDropdown(); // Update drawer UI
        }
    });

    drawerContent.addEventListener('click', (e) => {
        const pinIcon = e.target.closest('.icon-pin');
        if (pinIcon) {
            e.stopPropagation();
            const colId = pinIcon.getAttribute('data-id');
            if (currentTableMode === 'nested') {
                const idx = tempNestedPinnedColumnIds.indexOf(colId);
                if (idx > -1) {
                    tempNestedPinnedColumnIds.splice(idx, 1);
                } else {
                    tempNestedPinnedColumnIds.push(colId);
                }
            } else {
                const idx = tempPinnedColumnIds.indexOf(colId);
                if (idx > -1) {
                    tempPinnedColumnIds.splice(idx, 1);
                } else {
                    tempPinnedColumnIds.push(colId);
                }
            }
            renderDropdown(); // Update drawer UI only
        }
    });
}

// Drawer Save Button Handler
document.getElementById('btnColumnsDrawerSave')?.addEventListener('click', () => {
    if (currentTableMode === 'nested') {
        nestedColumnVisibility = { ...tempNestedColumnVisibility };
        nestedPinnedColumnIds = [ ...tempNestedPinnedColumnIds ];
    } else {
        compactColumnVisibility = { ...tempCompactColumnVisibility };
        pinnedColumnIds = [ ...tempPinnedColumnIds ];
    }
    renderTable();
    closeDrawer();
});

// Global Action Menu for Compact Mode
let globalActionMenu = document.getElementById('globalCompactActionMenu');
if (!globalActionMenu) {
    globalActionMenu = document.createElement('div');
    globalActionMenu.id = 'globalCompactActionMenu';
    globalActionMenu.style.cssText = 'display:none;position:fixed;background:#fff;border:1px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,0.15);border-radius:6px;z-index:999999;padding:8px 0;min-width:160px;white-space:nowrap;max-height:300px;overflow-y:auto;text-align:left;';
    
    const compactActionItems = [
        "编辑用户", "查看详情", "额度修改", "资金明细", "注单明细", "修改密码", "下级会员", "下级报表", "下级注单",
        "---",
        "交易设定", "赔率设置", "积分修改", "代理变更", "第三方游戏", "稽核记录", "代理变更记录", "回访备注",
        "隐藏资金明细", "快速登录变更", "校验用户任务", "谷歌验证码", "链上地址", "额度修改(链上充值)", "编辑标签", "用户标签编辑记录"
    ];
    globalActionMenu.innerHTML = compactActionItems.map(item => {
        if (item === '---') return `<div class="divider" style="height:1px;background-color:#e5e7eb;margin:4px 0;"></div>`;
        return `<a href="#" style="display:block;padding:8px 16px;color:#374151;text-decoration:none;font-size:13px;text-align:center;" onmouseover="this.style.backgroundColor='#f3f4f6';this.style.color='#3b82f6'" onmouseout="this.style.backgroundColor='transparent';this.style.color='#374151'">${item}</a>`;
    }).join('');
    
    document.body.appendChild(globalActionMenu);

    let hideTimeout;
    const hideMenu = () => {
        hideTimeout = setTimeout(() => {
            globalActionMenu.style.display = 'none';
        }, 150);
    };
    const showMenu = (iconEl) => {
        clearTimeout(hideTimeout);
        const rect = iconEl.getBoundingClientRect();
        globalActionMenu.style.display = 'block';
        globalActionMenu.style.top = (rect.bottom + 4) + 'px';
        globalActionMenu.style.left = (rect.right - globalActionMenu.offsetWidth) + 'px';
    };


    document.addEventListener('mouseover', (e) => {
        const icon = e.target.closest('.compact-action-icon');
        if (icon) {
            showMenu(icon);
        } else if (e.target.closest('#globalCompactActionMenu')) {
            clearTimeout(hideTimeout);
        } else {
            if (globalActionMenu.style.display === 'block') {
                hideMenu();
            }
        }
    });
}

// Sidebar Toggle Logic
const btnSidebarToggle = document.getElementById('btnSidebarToggle');
const mainLayout = document.querySelector('.main-layout');
if (btnSidebarToggle && mainLayout) {
    btnSidebarToggle.addEventListener('click', () => {
        mainLayout.classList.toggle('sidebar-collapsed');
    });
}

// Bottom Stats Bar Toggle Logic
const btnToggleStats = document.getElementById('btnToggleStats');
const bottomStatsBar = document.getElementById('bottomStatsBar');
if (btnToggleStats && bottomStatsBar) {
    btnToggleStats.addEventListener('click', () => {
        bottomStatsBar.classList.toggle('collapsed');
        document.body.classList.toggle('stats-collapsed');
    });
}

// Allow clicking anywhere in date range containers to open the native date/time picker
document.querySelectorAll('.date-range-container, .date-range-input').forEach(container => {
    container.addEventListener('click', (e) => {
        const inputs = container.querySelectorAll('input[type="datetime-local"], input[type="date"]');
        if (inputs.length > 0) {
            if (e.target === container || e.target.classList.contains('inline-label') || e.target.classList.contains('date-separator-line') || e.target.classList.contains('separator')) {
                const rect = container.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const targetInput = (clickX > rect.width / 2 && inputs.length > 1) ? inputs[1] : inputs[0];
                if (typeof targetInput.showPicker === 'function') {
                    try {
                        targetInput.showPicker();
                    } catch (err) {
                        console.error("showPicker error: ", err);
                    }
                }
            }
        }
    });
});

document.querySelectorAll('input[type="datetime-local"], input[type="date"]').forEach(input => {
    input.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof input.showPicker === 'function') {
            try {
                input.showPicker();
            } catch (err) {
                console.error("showPicker error: ", err);
            }
        }
    });
});

});