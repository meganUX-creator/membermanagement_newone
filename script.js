document.addEventListener('DOMContentLoaded', () => {
    let drawerCategoryVisibility = { '信贷': false };
    
    window.toggleCategoryVisibility = function(cat) {
        if (drawerCategoryVisibility[cat] === undefined) {
            drawerCategoryVisibility[cat] = false;
        } else {
            drawerCategoryVisibility[cat] = !drawerCategoryVisibility[cat];
        }
        
        // Update expanded rows without fully re-rendering
        if (currentTableMode === 'compact') {
            const isVisible = drawerCategoryVisibility[cat] !== false;
            document.querySelectorAll(`.detail-card[data-category="${cat}"]`).forEach(card => {
                card.style.display = isVisible ? 'block' : 'none';
            });
        }
        
        // Re-render drawer to update eye icon
        if (typeof renderDrawerStates === 'function') {
            renderDrawerStates();
        }
    };
    
    // Sidebar Toggle Logic
    const btnSidebarToggle = document.getElementById('btnSidebarToggle');
    const mainLayout = document.querySelector('.main-layout');
    if (btnSidebarToggle && mainLayout) {
        btnSidebarToggle.addEventListener('click', () => {
            mainLayout.classList.toggle('sidebar-collapsed');
        });
    }




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
                        inputAccount.placeholder = '请输入精确帐号';
                    } else if (value === 'fuzzy') {
                        inputAccount.placeholder = '请输入模糊帐号关键字';
                    } else if (value === 'multi') {
                        inputAccount.placeholder = "帐号以';'隔开，上限限制 50 个帐号";
                    } else {
                        inputAccount.placeholder = `请输入${selectedText}`;
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
                alert(`触发操作：${li.textContent.trim()}`);
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
                alert(`触发操作：${li.textContent.trim()}`);
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
            if (li.classList.contains('search-box-item')) {
                const input = li.querySelector('.dropdown-search-input');
                const btn = li.querySelector('button');

                if (input) {
                    const doSearch = () => {
                        const keyword = input.value.trim().toLowerCase();
                        optionsList.querySelectorAll('li:not(.search-box-item)').forEach(optLi => {
                            const text = optLi.textContent.trim().toLowerCase();
                            optLi.style.display = (keyword === '' || text === keyword) ? '' : 'none';
                        });
                    };
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            doSearch();
                        }
                    });
                    input.addEventListener('click', (e) => e.stopPropagation());
                    if (btn) {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            doSearch();
                        });
                    }
                }
                return;
            }

            li.addEventListener('click', (e) => {
                e.stopPropagation();
                const checkbox = li.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    li.classList.toggle('selected', checkbox.checked);
                    updateDisplay();
                    if (onChange) onChange();
                }
            });
        });

        function updateDisplay() {
            const selectedItems = [];
            optionsList.querySelectorAll('li.selected').forEach(li => {
                selectedItems.push(li.getAttribute('data-value'));
            });

            if (selectedItems.length === 0) {
                selectedValSpan.textContent = '请选择';
            } else if (selectedItems.length === 1) {
                selectedValSpan.textContent = selectedItems[0];
            } else {
                let displayText = selectedItems[0];
                let shownCount = 1;
                for (let i = 1; i < selectedItems.length; i++) {
                    if ((displayText + "、" + selectedItems[i]).length > 15) {
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
    let selectedVipVal = '';
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
        initSingleSelect(dropdownVip, (val) => {
            selectedVipVal = val;
        });
    }

    if (typeof dropdownOther !== 'undefined' && dropdownOther) {
        initMultiSelect(dropdownOther, () => {
        });
    }

    const dropdownUserTags = document.getElementById('dropdownUserTags');
    if (typeof dropdownUserTags !== 'undefined' && dropdownUserTags) {
        initMultiSelect(dropdownUserTags, () => {
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
    const inputBankCard = document.getElementById('inputBankCard') || { value: '' };
    const inputOfflineDays = document.getElementById('inputOfflineDays') || { value: '' };
    const inputIp = document.getElementById('inputIp') || { value: '' };
    const inputDeposit = document.getElementById('inputDeposit') || { value: '' };

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

    const urlParams = new URLSearchParams(window.location.search);
    const dataMode = urlParams.get('mock') || 'normal';
    window.dataMode = dataMode; // export globally if needed
    
    // Filter Row Extreme Mock
    if (dataMode === 'extreme') {
        const filterDropdowns = [
            'dropdownStatus', 'dropdownLevel', 'dropdownVip', 'dropdownUserTags', 
            'dropdownOther', 'dropdownBirthdayOuter', 'accountTypeDropdown'
        ];
        filterDropdowns.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (el.classList.contains('custom-select-multi')) {
                    el.querySelectorAll('li').forEach(li => {
                        if (!li.classList.contains('search-box-item')) {
                            const cb = li.querySelector('input[type="checkbox"]');
                            if (cb && !cb.checked) {
                                li.click();
                            }
                        }
                    });
                } else {
                    const options = Array.from(el.querySelectorAll('li')).filter(li => li.getAttribute('data-value') !== '');
                    if (options.length > 0) {
                        if (id === 'accountTypeDropdown') {
                            options[0].click(); // Select the first option for account type (帐号精确匹配)
                        } else {
                            options[options.length - 1].click();
                        }
                    }
                }
            }
        });

        const extremeInputValues = {
            'inputBankCardOuter': '4512 3456 7890 1234',
            'inputOfflineDaysOuter': '999999999',
            'inputAgentIdOuter': 'super_agent_extreme_long_id_99999999999999',
            'inputVipLevelOuter': '999999999',
            'inputIpOuter': '192.168.1.1',
            'inputDepositOuter': '99999999999999999',
            'inputAccount': 'test_user_123'
        };

        Object.keys(extremeInputValues).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.value = extremeInputValues[id];
            }
        });

        const dateInputs = ['inputDateStartOuter', 'inputDateEndOuter', 'inputDateStart', 'inputDateEnd'];
        const extremeDate = "9999-12-31T23:59";
        dateInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = extremeDate;
        });

        // Extreme Mock for top statistics
        const statYuEBao = document.getElementById('statYuEBao');
        const statTotalAmount = document.getElementById('statTotalAmount');
        const statThirdParty = document.getElementById('statThirdParty');
        const statReg = document.getElementById('statReg');
        const statFirstDep = document.getElementById('statFirstDep');
        
        if (statYuEBao) statYuEBao.innerText = '$ 9,999,999,999,999';
        if (statTotalAmount) statTotalAmount.innerText = '$ 9,999,999,999,999';
        if (statThirdParty) statThirdParty.innerText = '$ 9,999,999,999,999';
        if (statReg) statReg.innerText = '9,999,999,999';
        if (statFirstDep) statFirstDep.innerText = '9,999,999,999';
    }
    // Update static DOM elements if nodata
    if (dataMode === 'nodata') {
        const statYuEBao = document.getElementById('statYuEBao');
        const statTotalAmount = document.getElementById('statTotalAmount');
        const statThirdParty = document.getElementById('statThirdParty');
        const statReg = document.getElementById('statReg');
        const statFirstDep = document.getElementById('statFirstDep');
        
        if (statYuEBao) statYuEBao.innerText = '-';
        if (statTotalAmount) statTotalAmount.innerText = '-';
        if (statThirdParty) statThirdParty.innerText = '-';
        if (statReg) statReg.innerText = '-';
        if (statFirstDep) statFirstDep.innerText = '-';

        const editFormBirthday = document.getElementById('editFormBirthday');
        if (editFormBirthday) editFormBirthday.value = '';

        const filterDropdownsNoData = [
            'dropdownStatus', 'dropdownLevel', 'dropdownVip', 'dropdownUserTags', 
            'dropdownOther', 'dropdownBirthdayOuter', 'dropdownAgentId'
        ];
        filterDropdownsNoData.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const optionsList = el.querySelector('.select-options');
                const selectedVal = el.querySelector('.selected-val');
                if (optionsList) {
                    optionsList.innerHTML = '<li style="color: #999; text-align: center; cursor: not-allowed; padding: 12px; pointer-events: none;">暂无选项</li>';
                }
                if (selectedVal) {
                    selectedVal.innerText = '请选择';
                }
            }
        });

        const editFormPayLevel = document.getElementById('editFormPayLevel');
        if (editFormPayLevel) {
            editFormPayLevel.innerHTML = '<option selected disabled>暂无选项</option>';
        }
    }

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
    let nestedColumnsConfig = [
        { id: 'online', label: '在线' },
        { id: 'avatar', label: '头像' },
        { id: 'memberInfo', label: '会员信息' },
        { id: 'levelTeam', label: '等级&团队' },
        { id: 'creditLimit', label: '信用&额度' },
        { id: 'depositWithdraw', label: '存取款' },
        { id: 'tags', label: '标签' },
        { id: 'status', label: '状态' },
        { id: 'dateInfo', label: '日期信息' },
        { id: 'remark', label: '备注' }
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

    // --- Amount Formatting Helper ---
    function formatAmount(val) {
        if (window.dataMode === 'nodata') return '-';
        if (val === undefined || val === null || val === '-' || val === '' || val === '无数据') return val;
        let num = parseFloat(val);
        if (isNaN(num)) return val;
        return Math.floor(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    // --- Data State Rendering Helper ---
    function renderDataState(val, type = 'text') {
        if (window.dataMode === 'nodata' || val === '-' || val === null || val === undefined || val === '' || val === '无数据') {
            return `<span class="data-empty">-</span>`;
        }
        if (type === 'phone') {
            if (val === '未绑定' || val === '未验证') {
                return `<span class="tag-unbound">${val}</span>`;
            } else {
                return `<span class="tag-bound">已绑定</span>`;
            }
        }
        if (val === '未绑定' || val === '未验证') {
            return `<span class="tag-unbound">${val}</span>`;
        }
        if (val === '无权限') {
            return `<span class="tag-no-permission" title="无权限"><i class="ph-fill ph-lock"></i></span>`;
        }
        if (val === '获取失败') {
            return `<span class="data-error" title="获取失败"><i class="ph-fill ph-warning-circle"></i></span>`;
        }
        if (val === 'NaN-NaN-NaN' || val === '解析异常') {
            return `<span class="tag-parse-error" title="原数据异常，无法正确解析">${val === 'NaN-NaN-NaN' ? '解析异常' : val}</span>`;
        }
        if (val === '载入中') {
            return `<span class="data-loading" title="载入中"><i class="ph ph-spinner ph-spin"></i></span>`;
        }

        // Formats
        if (type === 'bankCard' || type === 'masked') {
            return `<span class="status-bound"><span class="data-masked">${val}</span></span>`;
        }
        if (type === 'longText') {
            return `<span class="text-truncate" title="${val}">${val}</span>`;
        }
        if (type === 'copyable') {
            return `<span class="copyable-text" onclick="alert('已复制：' + '${val}')" title="点击复制">${val}<i class="ph-bold ph-copy copy-icon"></i></span>`;
        }
        if (type === 'ip') {
            return `<a href="#" class="ip-link" data-ip="${val}" style="color: var(--primary-color); text-decoration: none;">${val}</a> <i class="ph ph-copy copy-ip-btn" data-ip="${val}" style="cursor: pointer; color: var(--text-muted);" title="复制IP"></i>`;
        }

        return val;
    }

    let compactColumnsConfig = [
        { id: 'online', group: '状态', label: '在线', checkboxIndex: 1, render: (user) => `<td data-col="online" style="text-align: center;">${dataMode === 'nodata' ? '-' : `<span class="status-dot-icon ${user.offlineDays === 0 ? 'online' : 'offline'}" title="${user.offlineDays === 0 ? '在线' : '离线'}"></span>`}</td>` },
        { id: 'uid', group: '基本', label: '用户ID', checkboxIndex: 3, render: (user) => `<td class="cell-val" data-col="uid">${dataMode === 'nodata' ? '-' : renderDataState(user.uid, 'copyable')}</td>` },
        { id: 'account', group: '基本', label: '会员名', checkboxIndex: 3, render: (user) => `<td data-col="account"><a href="#" class="cell-username user-detail-link" data-uid="${user.uid}">${renderDataState(user.account, 'copyable')}</a></td>` },
        { id: 'agentId', group: '基本', label: '代理', checkboxIndex: 3, render: (user) => `<td class="cell-val" data-col="agentId">${renderDataState(user.agentId)}</td>` },
        { id: 'status', group: '状态', label: '状态', checkboxIndex: 1, render: (user) => `<td data-col="status"><span class="user-custom-tag ${user.status === '正常' ? 'tag-green' : user.status === '冻结' ? 'tag-blue' : 'tag-red'}">${user.status}</span></td>` },
        { id: 'vipLevel', group: '等级', label: 'VIP等级', checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="vipLevel">${user.vipLevel || 'VIP ' + (user.vipLevel || 1)}</td>` },
        { id: 'payLevel', group: '等级', label: '支付层级', checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="payLevel">${user.payLevel}</td>` },
        { id: 'availableCredit', group: '额度', label: '可用额度', sortable: true, checkboxIndex: 5, render: (user) => `<td class="cell-money" data-col="availableCredit">${formatAmount(user.availableCredit)}</td>` },
        { id: 'thirdBal', group: '额度', label: '三方余额', sortable: true, checkboxIndex: 5, render: (user) => `<td class="cell-money" data-col="thirdBal"><div style="display:flex;align-items:center;justify-content:flex-end;">${formatAmount(user.thirdBal)} <i class="ph ph-arrows-clockwise refresh-icon-compact" data-uid="${user.uid}" style="margin-left:4px;cursor:pointer;color:#2563eb;" title="刷新余额"></i></div></td>` },
        { id: 'deposit', group: '存取款', label: '存款总额', sortable: true, checkboxIndex: 6, render: (user) => `<td class="cell-money ${user.deposit > 0 ? 'highlight' : ''}" data-col="deposit">${formatAmount(user.deposit)}</td>` },
        { id: 'withdraw', group: '存取款', label: '取款总额', sortable: true, checkboxIndex: 6, render: (user) => `<td class="cell-money" data-col="withdraw">${formatAmount(user.withdraw)}</td>` },
        { id: 'date', group: '日期信息', label: '新增时间', sortable: true, checkboxIndex: 9, render: (user) => `<td class="cell-val" data-col="date">${user.date}</td>` },
        { id: 'lastLogin', group: '日期信息', label: '登入时间', sortable: true, checkboxIndex: 9, render: (user) => `<td class="cell-val" data-col="lastLogin">${user.lastLogin}</td>` },
        { id: 'ip', group: '日期信息', label: '登入IP', checkboxIndex: 9, render: (user) => `<td class="cell-val" data-col="ip"><div class="ip-row" style="display: flex; align-items: center; gap: 4px;">${renderDataState(user.ip, 'ip')}</div></td>` },
        {
            id: 'action', group: '', label: '操作', checkboxIndex: 10, render: (user) => `<td class="cell-action sticky-col-right" data-col="action" style="text-align: center; width: 100px;">
            <div class="op-dropdown-container">
                <button type="button" class="btn-icon-only btn-text btn-op-more" style="border: none; background: transparent; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; margin: 0 auto; color: #1f2937; cursor: pointer;">
                    <i class="ph ph-dots-three" style="font-size:16px;"></i>
                </button>
                <ul class="op-dropdown-menu" style="white-space: nowrap;">
                    <li class="action-edit-user">编辑用户</li>
                    <li class="action-view-details">查看详情</li>
                    <li class="action-edit-balance">额度修改</li>
                    <li class="action-fund-detail">资金明细</li>
                    <li class="action-bet-detail">注单明细</li>
                    <li class="action-edit-password">修改密码</li>
                    <li class="action-sub-member">下级会员</li>
                    <li class="action-sub-report">下级报表</li>
                    <li class="action-sub-bet">下级注单</li>
                    <li class="action-trade-setting">交易设定</li>
                    <li class="action-odds-setting">赔率设置</li>
                    <li class="action-edit-point">积分修改</li>
                    <li class="action-edit-proxy">代理变更</li>
                    <li class="action-third-game">第三方游戏</li>
                    <li class="action-audit-record">稽核记录</li>
                    <li class="action-proxy-record">代理变更记录</li>
                    <li class="action-follow-remark">回访备注</li>
                    <li class="action-hide-fund">隐藏资金明细</li>
                    <li class="action-fast-login">快速登录变更</li>
                    <li class="action-verify-task">校验用户任务</li>
                    <li class="action-google-auth">谷歌验证码</li>
                    <li class="action-chain-address">链上地址</li>
                    <li class="action-edit-balance-chain">额度修改(链上充值)</li>
                    <li class="action-edit-tag">编辑标签</li>
                    <li class="action-tag-record">用户标签编辑纪录</li>
                </ul>
            </div>
        </td>` }
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
            if (modeDescriptionText) modeDescriptionText.textContent = '巢状结构：分组整合属性，减少表格栏位宽度';
            if (modeNoticeText) modeNoticeText.innerHTML = '<strong>巢状模式</strong>：将栏位属性垂直分组组合，画面精简展示。点击切换为压缩模式可展开所有独立列进行横向比对。';
            if (userTable) userTable.classList.remove('compact-mode-table');
        } else {
            if (btnModeCompact) btnModeCompact.classList.add('active');
            if (btnModeNested) btnModeNested.classList.remove('active');
            if (modeDescriptionText) modeDescriptionText.textContent = '压缩结构：扁平化所有属性，适合横向数据比对';
            if (modeNoticeText) modeNoticeText.innerHTML = '<strong>压缩模式</strong>：所有栏位变成独立的列，标题只出现在最上方一次，数据按行排列，方便横向比对，类似 Excel 的视图。';
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

    if (!window.baseMockUsers) {
        window.baseMockUsers = [];
    }
    const baseMockUsers = window.baseMockUsers;

    // Generate 200 items to ensure pagination works smoothly with up to 100 items per page
    const mockUsers = [];
    for (let i = 0; i < 20; i++) {
        baseMockUsers.forEach((user, index) => {
            const num = (i * 10) + index + 1;
            // Handle nodata cases where uid is '-' or account is '-'
            const parsedUid = parseInt(user.uid, 10);
            const newUid = isNaN(parsedUid) ? `uid_${num}` : (parsedUid + i * 100).toString();
            const newAccount = user.account === '-' ? '-' : (i === 0 ? user.account : `${user.account}_${i}`);

            // Dynamic ratio for tags
            let dynamicTags = [];
            let r = Math.random() * 100;
            if (i === 0) {
                // Keep the first 10 items exact to baseMockUsers to guarantee the initial page view has the exact ones
                dynamicTags = user.tags;
            } else {
                if (r < 75) {
                    dynamicTags = ["新注册"];
                } else if (r < 90) {
                    dynamicTags = ["正常", "活跃"];
                } else if (r < 97) {
                    dynamicTags = ["大户", "VIP 客户"];
                } else {
                    dynamicTags = ["异常风险", "VIP 客户"];
                }
            }

            mockUsers.push({
                ...user,
                uid: newUid,
                account: newAccount,
                tags: window.dataMode === 'nodata' ? [] : dynamicTags,
                offlineDays: window.dataMode === 'nodata' ? '-' : (user.offlineDays + i) % 15,
                other: window.dataMode === 'nodata' ? '-' : (index % 2 === 0 ? "未充值玩家" : "测试帐号"),
                vip: window.dataMode === 'nodata' ? '-' : (index % 3 === 0 ? "钻石会员" : index % 3 === 1 ? "黄金会员" : "白银会员"),
                level: window.dataMode === 'nodata' ? '-' : (index % 3 === 0 ? "VIP会员" : index % 3 === 1 ? "黄金会员" : "普通会员")
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
        selectedValSpan.textContent = '请选择';
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
            tags.push({ key: 'status', label: `状态: ${selectedStatusVal}`, type: 'single-custom', element: dropdownStatus, defaultValue: '', defaultText: '所有', valueVarSetter: (v) => selectedStatusVal = v });
        }
        // 2. Level
        if (selectedLevelVal) {
            tags.push({ key: 'level', label: `层级: ${selectedLevelVal}`, type: 'single-custom', element: dropdownLevel, defaultValue: '', defaultText: '全部', valueVarSetter: (v) => selectedLevelVal = v });
        }
        // 3. VIP (Multiple Select)
        if (selectedVipVal) {
            tags.push({ key: 'vip', label: `等级: ${selectedVipVal}`, type: 'single-custom', element: dropdownVip, defaultValue: '', defaultText: '请选择', valueVarSetter: (v) => selectedVipVal = v });
        }
        // 4. Other
        const selectedOthers = getMultiSelectValues(dropdownOther);
        if (selectedOthers.length > 0) {
            tags.push({ key: 'other', label: `其他: ${selectedOthers.join(', ')}`, type: 'multi-custom', element: dropdownOther });
        }
        // 5. Account
        if (inputAccount && inputAccount.value.trim()) {
            let labelPrefix = '帐号';
            if (currentAccountType === 'exact') labelPrefix = '帐号(精确)';
            if (currentAccountType === 'fuzzy') labelPrefix = '帐号(模糊)';
            if (currentAccountType === 'multi') labelPrefix = '帐号(多笔)';

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
            tags.push({ key: 'filterTestAccounts', label: `过滤测试账号`, type: 'checkbox', element: filterTestAccountsToggle });
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
                label: `时间: ${startStr} ~ ${endStr}`,
                type: 'inputs',
                elements: [inputDateStart, inputDateEnd]
            });
            advancedCount++;
        }
        const inputAgentId = document.getElementById('inputAgentId');
        if (inputAgentId && inputAgentId.value.trim()) {
            tags.push({ key: 'agentId', label: `代理Id: ${inputAgentId.value.trim()}`, type: 'input', element: inputAgentId });
            advancedCount++;
        }
        const inputVipLevel = document.getElementById('inputVipLevel');
        if (inputVipLevel && inputVipLevel.value.trim()) {
            tags.push({ key: 'vipLevel', label: `VIP等级: ${inputVipLevel.value.trim()}`, type: 'input', element: inputVipLevel });
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
            tags.push({ key: 'inviteCode', label: `邀请码: ${inputInviteCode.value.trim()}`, type: 'input', element: inputInviteCode });
            advancedCount++;
        }
        if (inputNickname.value.trim()) {
            tags.push({ key: 'nickname', label: `暱称: ${inputNickname.value.trim()}`, type: 'input', element: inputNickname });
            advancedCount++;
        }
        if (inputRealName.value.trim()) {
            tags.push({ key: 'realName', label: `姓名: ${inputRealName.value.trim()}`, type: 'input', element: inputRealName });
            advancedCount++;
        }
        if (inputBankCard.value.trim()) {
            tags.push({ key: 'bankCard', label: `银行卡末码: *${inputBankCard.value.trim()}`, type: 'input', element: inputBankCard });
            advancedCount++;
        }
        if (inputOfflineDays.value.trim()) {
            tags.push({ key: 'offlineDays', label: `未登入天数 > ${inputOfflineDays.value.trim()}`, type: 'input', element: inputOfflineDays });
            advancedCount++;
        }
        if (inputIp.value.trim()) {
            tags.push({ key: 'ip', label: `IP: ${inputIp.value.trim()}`, type: 'input', element: inputIp });
            advancedCount++;
        }
        if (inputDeposit.value.trim()) {
            tags.push({ key: 'deposit', label: `存款 > ${inputDeposit.value.trim()}`, type: 'input', element: inputDeposit });
            advancedCount++;
        }

        // Outer fields processing
        const inputAgentIdOuter = document.getElementById('inputAgentIdOuter');
        if (inputAgentIdOuter && inputAgentIdOuter.value.trim()) {
            tags.push({ key: 'agentIdOuter', label: `代理Id: ${inputAgentIdOuter.value.trim()}`, type: 'input', element: inputAgentIdOuter });
        }
        const inputVipLevelOuter = document.getElementById('inputVipLevelOuter');
        if (inputVipLevelOuter && inputVipLevelOuter.value.trim()) {
            tags.push({ key: 'vipLevelOuter', label: `VIP等级: ${inputVipLevelOuter.value.trim()}`, type: 'input', element: inputVipLevelOuter });
        }
        if (selectedBirthdayOuterVal) {
            tags.push({ key: 'birthdayOuter', label: `生日: ${selectedBirthdayOuterVal}月`, type: 'single-custom', element: dropdownBirthdayOuter, defaultValue: '', defaultText: '全部', valueVarSetter: (v) => selectedBirthdayOuterVal = v });
        }
        if (inputDateStartOuter && inputDateEndOuter && (inputDateStartOuter.value || inputDateEndOuter.value)) {
            const startStr = inputDateStartOuter.value ? inputDateStartOuter.value.replace('T', ' ') : '??';
            const endStr = inputDateEndOuter.value ? inputDateEndOuter.value.replace('T', ' ') : '??';
            tags.push({
                key: 'dateRangeOuter',
                label: `新增时间: ${startStr} ~ ${endStr}`,
                type: 'inputs',
                elements: [inputDateStartOuter, inputDateEndOuter]
            });
        }
        if (inputBankCardOuter && inputBankCardOuter.value.trim()) {
            tags.push({ key: 'bankCardOuter', label: `绑定银行卡: ${inputBankCardOuter.value.trim()}`, type: 'input', element: inputBankCardOuter });
        }
        if (inputOfflineDaysOuter && inputOfflineDaysOuter.value.trim()) {
            tags.push({ key: 'offlineDaysOuter', label: `未登入天数 > ${inputOfflineDaysOuter.value.trim()}`, type: 'input', element: inputOfflineDaysOuter });
        }
        if (inputIpOuter && inputIpOuter.value.trim()) {
            tags.push({ key: 'ipOuter', label: `登入 IP: ${inputIpOuter.value.trim()}`, type: 'input', element: inputIpOuter });
        }
        if (inputDepositOuter && inputDepositOuter.value.trim()) {
            tags.push({ key: 'depositOuter', label: `存款大于 ${inputDepositOuter.value.trim()}`, type: 'input', element: inputDepositOuter });
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

        if (tags.length > 0) {
            const clearAllBtn = document.createElement('button');
            clearAllBtn.className = 'btn btn-icon btn-sm btn-clear-all-tags';
            clearAllBtn.title = '清除所有标签';
            clearAllBtn.innerHTML = '<i class="ph ph-trash"></i>';
            clearAllBtn.style.marginLeft = 'auto';
            clearAllBtn.style.color = '#ef4444';
            clearAllBtn.style.border = 'none';
            clearAllBtn.style.background = 'transparent';
            clearAllBtn.style.cursor = 'pointer';
            clearAllBtn.style.padding = '4px';
            
            clearAllBtn.addEventListener('click', () => {
                // Expand search section if collapsed
                const searchSection = document.querySelector('.search-section');
                const btnToggleSearch = document.getElementById('btnToggleSearch');
                if (searchSection && searchSection.classList.contains('collapsed')) {
                    searchSection.classList.remove('collapsed');
                    if (btnToggleSearch) {
                        btnToggleSearch.innerHTML = '收起筛选 <i class="ph ph-caret-up"></i>';
                        btnToggleSearch.classList.remove('btn-primary');
                        btnToggleSearch.classList.add('btn-outline');
                    }
                }
                
                // Let the browser apply the CSS transition and class changes before blocking the main thread
                setTimeout(() => {
                    clearAllFilters();
                }, 10);
            });
            filterTagsContainer.appendChild(clearAllBtn);
        }
    }

    // Reset all filters
    function clearAllFilters() {
        setSingleSelectValue(dropdownStatus, '', '所有');
        selectedStatusVal = '';

        if (filterTestAccountsToggle) filterTestAccountsToggle.checked = false;

        setSingleSelectValue(dropdownLevel, '', '全部');
        selectedLevelVal = '';

        setSingleSelectValue(dropdownVip, '', '请选择');
        selectedVipVal = '';
        clearMultiSelectValue(dropdownOther);

        const inputAccount = document.getElementById('inputAccount');
        if (inputAccount) inputAccount.value = '';
        // Reset advanced
        const inputAgentId = document.getElementById('inputAgentId');
        if (inputAgentId) inputAgentId.value = '';
        const inputVipLevel = document.getElementById('inputVipLevel');
        if (inputVipLevel) inputVipLevel.value = '';
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
        const inputAgentIdOuter = document.getElementById('inputAgentIdOuter');
        if (inputAgentIdOuter) inputAgentIdOuter.value = '';
        const inputVipLevelOuter = document.getElementById('inputVipLevelOuter');
        if (inputVipLevelOuter) inputVipLevelOuter.value = '';

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

    function renderTable(skipDelay = false) {
        const previouslyExpanded = [];
        if (userTableBody) {
            userTableBody.querySelectorAll('.expand-btn.ph-caret-down').forEach(btn => {
                const uid = btn.getAttribute('data-uid');
                if (uid) previouslyExpanded.push(uid);
            });
        }
        
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

        const birthdayVal = (selectBirthday ? selectBirthday.value : '') || (selectBirthdayOuter ? selectBirthdayOuter.value : '');
        const dateStartVal = (inputDateStart ? inputDateStart.value : '') || (inputDateStartOuter ? inputDateStartOuter.value : '');
        const dateEndVal = (inputDateEnd ? inputDateEnd.value : '') || (inputDateEndOuter ? inputDateEndOuter.value : '');
        const quickLoginVal = inputQuickLogin ? inputQuickLogin.value.trim() : '';
        const uidVal = inputUid ? inputUid.value.trim() : '';
        const inviteCodeVal = inputInviteCode ? inputInviteCode.value.trim() : '';
        const nicknameVal = inputNickname ? inputNickname.value.trim().toLowerCase() : '';
        const realNameVal = inputRealName ? inputRealName.value.trim() : '';
        const inputAgentIdOuter = document.getElementById('inputAgentIdOuter');
        const inputAgentId = document.getElementById('inputAgentId');
        const agentIdVal = (inputAgentId ? inputAgentId.value.trim() : '') || (inputAgentIdOuter ? inputAgentIdOuter.value.trim() : '');
        const inputVipLevelOuter = document.getElementById('inputVipLevelOuter');
        const inputVipLevel = document.getElementById('inputVipLevel');
        const vipLevelVal = (inputVipLevel ? inputVipLevel.value.trim() : '') || (inputVipLevelOuter ? inputVipLevelOuter.value.trim() : '');
        const bankCardVal = inputBankCard.value.trim();
        const offlineDaysVal = parseInt(inputOfflineDays.value.trim(), 10);
        const ipVal = inputIp.value.trim();
        const depositVal = parseFloat(inputDeposit.value.trim());

        // Perform Filtering
        let filtered = mockUsers;
        if (window.dataMode !== 'extreme') {
            filtered = mockUsers.filter(user => {
                if (selectedStatusVal && user.status !== selectedStatusVal) return false;
                if (selectedLevelVal && user.level !== selectedLevelVal) return false;
                if (selectedVipVal && user.vip !== selectedVipVal) return false;
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
                if (agentIdVal && user.agentId !== agentIdVal) return false;
                if (vipLevelVal && user.vipLevel !== undefined && user.vipLevel.toString() !== vipLevelVal) return false;
                if (bankCardVal && !user.bankCard.includes(bankCardVal)) return false;
                if (!isNaN(offlineDaysVal) && user.offlineDays <= offlineDaysVal) return false;
                if (ipVal && !user.ip.includes(ipVal)) return false;
                if (!isNaN(depositVal) && user.deposit <= depositVal) return false;

                return true;
            });
        }

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
                        const isPinned = nestedPinnedColumnIds && nestedPinnedColumnIds.includes(col.id);
                        const stickyClass = isPinned ? 'sticky-col sticky-col-header' : '';
                        nestedHeaderHtml += `<th class="${stickyClass}">${col.label}</th>`;
                    }
                });
                nestedHeaderHtml += `<th style="text-align: center; width: 190px;">
                    <button type="button" class="btn-custom-columns-header btn-header-columns-toggle" title="自订栏位">
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

                let headerHtml = `<th class="header-sub sticky-col" data-col="expand" style="left:0; width: 40px; text-align: center; z-index:12;">
                    <i class="ph ph-caret-right expand-all-btn" style="cursor:pointer; font-size:16px; color: var(--text-main);" title="全部展开/收合"></i>
                </th>
                <th class="header-group sticky-col sticky-col-1" width="40" style="left:40px; z-index:12;"><input type="checkbox" id="selectAllCheckboxCompact"></th>`;

                let currentLeft = 80; // Starts after expand and checkbox

                // Pinned headers
                pinned.forEach(col => {
                    const isMoney = ['availableCredit', 'thirdBal', 'deposit', 'withdraw'].includes(col.id);
                    const justifyAttr = isMoney ? 'flex-end' : 'space-between';
                    headerHtml += `<th class="header-sub sticky-col" style="left:${currentLeft}px; min-width:110px; z-index:12;" data-col="${col.id}">
                        <div style="display:flex;align-items:center;white-space:nowrap;justify-content:${justifyAttr};${isMoney ? ' gap: 4px;' : ''}">
                            <div style="display:flex;align-items:center;">
                                <span>${col.label}</span>
                            </div>
                            ${col.sortable
                            ? `<div class="header-actions-dropdown">
                                    <button class="btn-icon-only btn-text" style="color: var(--text-muted);"><i class="ph ph-dots-three" style="font-size:16px;"></i></button>
                                    <div class="header-actions-menu">
                                        ${getSortBtn(col.id)}
                                        <i class="ph ph-push-pin icon-pin active" style="opacity:1; margin-left:0;" data-id="${col.id}" title="取消钉选"></i>
                                    </div>
                                   </div>`
                            : `<i class="ph ph-push-pin icon-pin active" data-id="${col.id}" title="取消钉选"></i>`
                        }
                        </div>
                        <div class="resizer"></div>
                    </th>`;
                    currentLeft += 110;
                });

                const actionCol = visibleColumnsConfig.find(col => col.id === 'action');
                let actionHeaderHtml = '';
                if (actionCol) {
                    actionHeaderHtml = `<th class="header-sub sticky-col-right" data-col="action" style="min-width: 60px; z-index:12;">
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

                // Unpinned headers sequentially
                // Unpinned headers sequentially
                const unpinnedWithoutAction = unpinned.filter(col => col.id !== 'action');
                unpinnedWithoutAction.forEach(col => {
                    const isMoney = ['availableCredit', 'thirdBal', 'deposit', 'withdraw'].includes(col.id);
                    const justifyAttr = isMoney ? 'flex-end' : 'space-between';
                    headerHtml += `<th class="header-sub" data-col="${col.id}">
                        <div style="display:flex;align-items:center;white-space:nowrap;justify-content:${justifyAttr};${isMoney ? ' gap: 4px;' : ''}">
                            <div style="display:flex;align-items:center;">
                                <span>${col.label}</span>
                            </div>
                            ${col.sortable
                            ? `<div class="header-actions-dropdown">
                                    <button class="btn-icon-only btn-text" style="color: var(--text-muted);"><i class="ph ph-dots-three" style="font-size:16px;"></i></button>
                                    <div class="header-actions-menu">
                                        ${getSortBtn(col.id)}
                                        <i class="ph ph-push-pin icon-pin" style="opacity:1; margin-left:0;" data-id="${col.id}" title="钉选栏位"></i>
                                    </div>
                                   </div>`
                            : `<i class="ph ph-push-pin icon-pin" data-id="${col.id}" title="钉选栏位"></i>`
                        }
                        </div>
                        <div class="resizer"></div>
                    </th>`;
                });

                if (actionHeaderHtml) {
                    headerHtml += actionHeaderHtml;
                }

                userTableHeader.innerHTML = `
                    <tr class="header-sub-row">${headerHtml}</tr>
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
        if (!skipDelay && userTableBody) {
            userTableBody.innerHTML = skeletonHtml;
        }

        if (window.renderTableTimeout) clearTimeout(window.renderTableTimeout);
        const executeRender = () => {
            if (!userTableBody) return;
            userTableBody.innerHTML = '';
            if (pagedUsers.length === 0) {
                let colspanForLoading = currentTableMode === 'nested' 
                    ? (nestedColumnsConfig.filter(c => nestedColumnVisibility[c.id]).length + 2)
                    : (compactColumnsConfig.filter(c => compactColumnVisibility[c.id]).length + 2);
                userTableBody.innerHTML = `<tr><td colspan="${colspanForLoading}" style="text-align: center; color: var(--text-muted); padding: 32px 0;">无符合筛选条件的会员资料</td></tr>`;
                applyColumnVisibility();
                return;
            }

            pagedUsers.forEach(user => {
                const tr = document.createElement('tr');

                let rowClass = '';
                if (rowClass) {
                    tr.classList.add(rowClass);
                }

                if (currentTableMode === 'nested') {
                    // Nested Mode Layout
                    let nestedRowHtml = `<td style="text-align: center;"><input type="checkbox" class="user-checkbox"></td>`;

                    nestedColumnsConfig.forEach(col => {
                        if (!nestedColumnVisibility[col.id]) return;
                        
                        // Handle sticky frozen columns
                        const isPinned = nestedPinnedColumnIds && nestedPinnedColumnIds.includes(col.id);
                        const stickyClass = isPinned ? 'sticky-col' : '';

                        if (col.id === 'online') {
                            nestedRowHtml += `<td class="${stickyClass}" style="text-align: center;">
                            ${window.dataMode === 'nodata' ? '-' : `<span class="status-dot-icon ${user.offlineDays === 0 ? 'online' : 'offline'}" title="${user.offlineDays === 0 ? '在线' : '离线'}"></span>`}
                        </td>`;
                        } else if (col.id === 'avatar') {
                            nestedRowHtml += `<td class="${stickyClass}" style="text-align: center;">
                            <div class="user-avatar-circle-grey">
                                <i class="ph-fill ph-user"></i>
                            </div>
                        </td>`;
                        } else if (col.id === 'memberInfo') {
                            nestedRowHtml += `<td class="nested-cell-info ${stickyClass}">
                            <div><span class="info-label">用户ID :</span> ${dataMode === 'nodata' ? '-' : renderDataState(user.uid, 'copyable')}</div>
                            <div><span class="info-label">会员名 :</span> <a href="#" class="user-detail-link" data-uid="${user.uid}">${renderDataState(user.account, 'copyable')}</a></div>
                            <div><span class="info-label">真实姓名 :</span> ${renderDataState(user.realName)}</div>
                            <div><span class="info-label">用户暱称 :</span> ${renderDataState(user.nickname)}</div>
                            <div><span class="info-label">代理 :</span> ${renderDataState(user.agentId)}</div>
                            <div><span class="info-label">邀请人 :</span> ${renderDataState(user.inviter)}</div>
                            <div><span class="info-label">注册模式 :</span> ${user.registerMode || '一般注册'}</div>
                            <div><span class="info-label">手机号 :</span> ${renderDataState(user.phone, 'phone')}</div>
                        </td>`;
                        } else if (col.id === 'levelTeam') {
                            nestedRowHtml += `<td class="nested-cell-info ${stickyClass}">
                            <div><span class="info-label">支付层级 :</span> ${user.payLevel || '默认层'}</div>
                            <div><span class="info-label">成长值 :</span> ${user.growth || 0}</div>
                            <div><span class="info-label">等级 :</span> <strong class="${user.level === '黄金会员' ? 'level-gold' : ''}">${user.level}</strong></div>
                            <div><span class="info-label">帐号类型 :</span> ${user.accountType || '普通帐号'}</div>
                            <div><span class="info-label">会员类型 :</span> ${user.userType || '代理会员'}</div>
                            <div><span class="info-label">邀请码 :</span> ${user.inviteCode || '-'}</div>
                            <div><span class="info-label">直属下级/团队人数 :</span> <a href="#" class="subordinate-link" style="color: var(--primary-color); text-decoration: underline;" data-uid="${user.uid}">${user.directTeam || '0/0'}</a></div>
                            <div><span class="info-label">VIP会员等级 :</span> ${user.vipLevel || 0}</div>
                            <div><span class="info-label">VIP成长值 :</span> ${user.vipGrowth || 0}</div>
                        </td>`;
                        } else if (col.id === 'creditLimit') {
                            nestedRowHtml += `<td class="nested-cell-info ${stickyClass}">
                            <div><span class="info-label">信用值 :</span> ${formatAmount(user.creditValue)}</div>
                            <div><span class="info-label">可用额度 :</span> ${formatAmount(user.availableCredit)}</div>
                            <div><span class="info-label">佣金余额 :</span> ${formatAmount(user.commissionBal)}</div>
                            <div><span class="info-label">诊额宝 :</span> ${formatAmount(user.balanceBuy)}</div>
                            <div><span class="info-label">欠款 :</span> ${formatAmount(user.arrears)}</div>
                            <div><span class="info-label">余额宝利息 :</span> ${formatAmount(user.interest)}</div>
                            <div><span class="info-label">三方余额 :</span> ${formatAmount(user.thirdBal)} <a href="#" class="refresh-link" style="color:#2563eb;font-size:12px;margin-left:4px;text-decoration:none;">刷新</a></div>
                            <div><span class="info-label">会员积分 :</span> ${user.points || 0}</div>
                        </td>`;
                        } else if (col.id === 'depositWithdraw') {
                            nestedRowHtml += `<td class="nested-cell-info ${stickyClass}">
                            <div><span class="info-label">存款总额 :</span> ${formatAmount(user.deposit)}</div>
                            <div><span class="info-label">取款总额 :</span> ${formatAmount(user.withdraw)}</div>
                            <div><span class="info-label">提款预扣金额 :</span> ${formatAmount(user.withdrawPre)}</div>
                            <div><span class="info-label">后台扣款总额 :</span> ${formatAmount(user.adminDeduct)}</div>
                            <div><span class="info-label">存款次数 :</span> ${user.depositCount || 0}</div>
                            <div><span class="info-label">取款次数 :</span> ${user.withdrawCount || 0}</div>
                        </td>`;
                        } else if (col.id === 'tags') {
                            const tagStyles = { '正常': 'tag-blue', 'VIP 客户': 'tag-blue', 'VIP': 'tag-blue', '活跃': 'tag-green', '高频交易': 'tag-green', '大户': 'tag-purple', '高消费': 'tag-purple', '异常风险': 'tag-red' };
                            let nestedTagsOutput = user.tags.map(tag => {
                                let styleClass = tagStyles[tag] || 'tag-grey';
                                if (tag === '异常风险') {
                                    return `<span class="user-custom-tag ${styleClass}"><i class="ph-fill ph-warning-circle" style="margin-right: 4px; font-size: 13px;"></i>${tag}</span>`;
                                }
                                return `<span class="user-custom-tag ${styleClass}">${tag}</span>`;
                            }).join('');

                            nestedRowHtml += `<td class="${stickyClass}">
                            <div class="user-tags-container" style="flex-wrap: wrap;">
                                ${nestedTagsOutput}
                            </div>
                        </td>`;
                        } else if (col.id === 'status') {
                            nestedRowHtml += `<td class="${stickyClass}">
                            <span class="user-custom-tag ${user.status === '正常' ? 'tag-blue' : user.status === '冻结' ? 'tag-blue' : 'tag-red'}">${user.status}</span>
                        </td>`;
                        } else if (col.id === 'dateInfo') {
                            nestedRowHtml += `<td class="nested-cell-info ${stickyClass}">
                            <div><span class="info-label">新增时间 :</span> ${renderDataState(user.date)}</div>
                            <div><span class="info-label">最后登录 :</span> ${renderDataState(user.lastLogin)}</div>
                            <div><span class="info-label">离开天数 :</span> ${user.offlineDays === '-' ? '-' : user.offlineDays + '天'}</div>
                            <div><span class="info-label">登录IP :</span></div>
                            <div class="ip-row" style="display: flex; align-items: center; gap: 4px;">
                                ${renderDataState(user.ip, 'ip')}
                            </div>
                        </td>`;
                        } else if (col.id === 'remark') {
                            nestedRowHtml += `<td class="nested-cell-info ${stickyClass}">
                            <div><span class="info-label">备注 :</span> ${renderDataState(user.remark, 'longText')}</div>
                            <div><span class="info-label">回访备注 :</span> ${renderDataState(user.followRemark, 'longText')}</div>
                            <div><span class="info-label">注 :</span> ${renderDataState(user.note, 'longText')}</div>
                        </td>`;
                        }
                    });

                    nestedRowHtml += `<td style="text-align: center; padding: 12px 8px;">
                    <div class="operations-grid-3x3">
                        <a href="#" class="op-link user-detail-link action-edit-user" data-uid="${user.uid}">编辑用户</a>
                        <a href="#" class="op-link user-detail-link action-view-details" data-uid="${user.uid}">查看详情</a>
                        <a href="#" class="op-link action-edit-balance">额度修改</a>
                        <a href="#" class="op-link action-fund-detail">资金明细</a>
                        <a href="#" class="op-link action-bet-detail">注单明细</a>
                        <a href="#" class="op-link action-edit-password">修改密码</a>
                        <a href="#" class="op-link action-sub-member">下级会员</a>
                        <a href="#" class="op-link action-sub-report">下级报表</a>
                        <a href="#" class="op-link action-sub-bet">下级注单</a>
                    </div>
                    <div class="more-op-dropdown-container">
                        <button class="btn-more-op-wide">更多...</button>
                        <ul class="more-op-dropdown-menu">
                            <li class="action-trade-setting">交易设定</li>
                            <li class="action-odds-setting">赔率设置</li>
                            <li class="action-edit-point">积分修改</li>
                            <li class="action-edit-proxy">代理变更</li>
                            <li class="action-third-game">第三方游戏</li>
                            <li class="action-audit-record">稽核记录</li>
                            <li class="action-proxy-record">代理变更记录</li>
                            <li class="action-follow-remark">回访备注</li>
                            <li class="action-hide-fund">隐藏资金明细</li>
                            <li class="action-fast-login">快速登录变更</li>
                            <li class="action-verify-task">校验用户任务</li>
                            <li class="action-google-auth">谷歌验证码</li>
                            <li class="action-chain-address">链上地址</li>
                            <li class="action-edit-balance-chain">额度修改(链上充值)</li>
                            <li class="action-edit-tag">编辑标签</li>
                            <li class="action-tag-record">用户标签编辑记录</li>
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

                    let cellsHtml = `<td class="cell-val sticky-col" data-col="expand" style="width: 40px; text-align: center; left: 0px;"><i class="ph ph-caret-right expand-btn" style="cursor:pointer; font-size:16px;" data-uid="${user.uid}"></i></td>
                <td class="sticky-col sticky-col-1" style="left:40px;"><input type="checkbox" class="user-checkbox"></td>`;

                    let currentLeft = 80;
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

                if (currentTableMode === 'compact') {
                    // Add expanded detail row
                    const expandTr = document.createElement('tr');
                    expandTr.className = 'expanded-detail-row';
                    expandTr.style.display = 'none';

                    const colCount = compactColumnsConfig.length + 2; // +1 for checkbox, +1 for expand
                    expandTr.innerHTML = `
                    <td colspan="${colCount}" style="padding: 16px; background: #f8fafc; border-bottom: 1px solid var(--border-color);">
                        <div class="detail-cards-wrapper" style="display:flex; gap:16px; flex-wrap:nowrap; overflow-x:auto; padding: 0 40px; padding-bottom: 8px;">
                            <!-- 大头照 -->
                            <div style="flex: 0 0 60px; display:flex; justify-content:center; align-items:flex-start; margin-top: 8px;">
                                <div style="width:60px; height:60px; background:#6366f1; color:white; border-radius:8px; display:flex; justify-content:center; align-items:center; font-size:24px; font-weight:bold;">${user.account.charAt(0).toUpperCase()}</div>
                            </div>
                            <!-- 基本资料 -->
                            <div class="detail-card" data-category="基本资料" style="flex: 0 0 auto; width: max-content; display: ${drawerCategoryVisibility['基本资料'] !== false ? 'block' : 'none'};">
                                <div class="detail-card-header"><i class="ph ph-user"></i> 基本资料</div>
                                <div class="detail-card-body grid-2-col">
                                    <div class="ds-field" data-ds-id="ds_realname" style="display:${dataSourceFieldVisibility['ds_realname'] !== false ? '' : 'none'}"><span class="lbl">真实姓名</span> <span class="val">${user.realName}</span></div>
                                    <div class="ds-field" data-ds-id="ds_birthday" style="display:${dataSourceFieldVisibility['ds_birthday'] !== false ? '' : 'none'}"><span class="lbl">生日</span> <span class="val">${dataMode === 'nodata' ? '-' : '1991-02-11'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_accountType" style="display:${dataSourceFieldVisibility['ds_accountType'] !== false ? '' : 'none'}"><span class="lbl">帐号类型</span> <span class="val">${user.userType || '代理会员'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_memberType" style="display:${dataSourceFieldVisibility['ds_memberType'] !== false ? '' : 'none'}"><span class="lbl">会员类型</span> <span class="val">${user.payLevel || '默认层'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_level" style="display:${dataSourceFieldVisibility['ds_level'] !== false ? '' : 'none'}"><span class="lbl">等级</span> <span class="val">${dataMode === 'nodata' ? '-' : (user.vipLevel ? 'VIP ' + user.vipLevel : 'VIP 1')}</span></div>
                                    <div class="ds-field" data-ds-id="ds_regMode" style="display:${dataSourceFieldVisibility['ds_regMode'] !== false ? '' : 'none'}"><span class="lbl">注册模式</span> <span class="val">${user.registerMode || '一般注册'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_nickname" style="display:${dataSourceFieldVisibility['ds_nickname'] !== false ? '' : 'none'}"><span class="lbl">昵称</span> <span class="val">${user.nickname || '-'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_phone" style="display:${dataSourceFieldVisibility['ds_phone'] !== false ? '' : 'none'}"><span class="lbl">手机号</span> <span class="val">${dataMode === 'nodata' ? '-' : renderDataState(user.phone, 'phone')}</span></div>
                                </div>
                            </div>
                            <!-- 资金与存取款 -->
                            <div class="detail-card" data-category="资金与存取款" style="flex: 0 0 auto; width: max-content; display: ${drawerCategoryVisibility['资金与存取款'] !== false ? 'block' : 'none'};">
                                <div class="detail-card-header"><i class="ph ph-coins"></i> 资金与存取款</div>
                                <div class="detail-card-body grid-2-col">
                                    <div class="ds-field" data-ds-id="ds_depTotal" style="display:${dataSourceFieldVisibility['ds_depTotal'] !== false ? '' : 'none'}"><span class="lbl">存款总额</span> <span class="val text-blue">${formatAmount(user.deposit)}</span></div>
                                    <div class="ds-field" data-ds-id="ds_depCount" style="display:${dataSourceFieldVisibility['ds_depCount'] !== false ? '' : 'none'}"><span class="lbl">存款次数</span> <span class="val">${user.depositCount || '0'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_wdrTotal" style="display:${dataSourceFieldVisibility['ds_wdrTotal'] !== false ? '' : 'none'}"><span class="lbl">取款总额</span> <span class="val text-blue">${formatAmount(user.withdraw)}</span></div>
                                    <div class="ds-field" data-ds-id="ds_wdrCount" style="display:${dataSourceFieldVisibility['ds_wdrCount'] !== false ? '' : 'none'}"><span class="lbl">取款次数</span> <span class="val">${user.withdrawCount || '0'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_wdrFee" style="display:${dataSourceFieldVisibility['ds_wdrFee'] !== false ? '' : 'none'}"><span class="lbl">提款预扣金额</span> <span class="val">${formatAmount(user.withdrawPre)}</span></div>
                                    <div class="ds-field" data-ds-id="ds_sysAdd" style="display:${dataSourceFieldVisibility['ds_sysAdd'] !== false ? '' : 'none'}"><span class="lbl">后台加款总额</span> <span class="val text-green">${dataMode === 'nodata' ? '-' : '200'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_sysSub" style="display:${dataSourceFieldVisibility['ds_sysSub'] !== false ? '' : 'none'}"><span class="lbl">后台扣款总额</span> <span class="val text-red">${dataMode === 'nodata' ? '-' : '0'}</span></div>
                                </div>
                            </div>
                            <!-- 成长与积分 -->
                            <div class="detail-card" data-category="成长与积分" style="flex: 0 0 auto; width: max-content; display: ${drawerCategoryVisibility['成长与积分'] !== false ? 'block' : 'none'};">
                                <div class="detail-card-header"><i class="ph ph-trend-up"></i> 成长与积分</div>
                                <div class="detail-card-body flex-list-col">
                                    <div class="ds-field" data-ds-id="ds_growth" style="display:${dataSourceFieldVisibility['ds_growth'] !== false ? '' : 'none'}"><span class="lbl">成长值</span> <span class="val">${user.growth || '0'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_vipGrowth" style="display:${dataSourceFieldVisibility['ds_vipGrowth'] !== false ? '' : 'none'}"><span class="lbl">VIP成长值</span> <span class="val">${user.vipGrowth || '0'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_points" style="display:${dataSourceFieldVisibility['ds_points'] !== false ? '' : 'none'}"><span class="lbl">会员积分</span> <span class="val">${user.points || '0'}</span></div>
                                </div>
                            </div>
                            <!-- 推荐关系 -->
                            <div class="detail-card" data-category="推荐关系" style="flex: 0 0 auto; width: max-content; display: ${drawerCategoryVisibility['推荐关系'] !== false ? 'block' : 'none'};">
                                <div class="detail-card-header"><i class="ph ph-share-network"></i> 推荐关系</div>
                                <div class="detail-card-body flex-list-col">
                                    <div class="ds-field" data-ds-id="ds_inviter" style="display:${dataSourceFieldVisibility['ds_inviter'] !== false ? '' : 'none'}"><span class="lbl">邀请人</span> <span class="val">${user.inviter || '-'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_inviteCode" style="display:${dataSourceFieldVisibility['ds_inviteCode'] !== false ? '' : 'none'}"><span class="lbl">邀请码</span> <span class="val">${user.inviteCode || '-'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_team" style="display:${dataSourceFieldVisibility['ds_team'] !== false ? '' : 'none'}"><span class="lbl">下级/团队</span> <a href="#" class="val subordinate-link text-blue" style="text-decoration: underline;" data-uid="${user.uid}">${user.directTeam || '0/0'}</a></div>
                                    <div class="ds-field" data-ds-id="ds_commBal" style="display:${dataSourceFieldVisibility['ds_commBal'] !== false ? '' : 'none'}"><span class="lbl">佣金余额</span> <span class="val text-red">${formatAmount(user.commissionBal)}</span></div>
                                </div>
                            </div>
                            <!-- 余额宝 -->
                            <div class="detail-card" data-category="余额宝" style="flex: 0 0 auto; width: max-content; display: ${drawerCategoryVisibility['余额宝'] !== false ? 'block' : 'none'};">
                                <div class="detail-card-header"><i class="ph ph-wallet"></i> 余额宝</div>
                                <div class="detail-card-body flex-list-col">
                                    <div class="ds-field" data-ds-id="ds_balTreas" style="display:${dataSourceFieldVisibility['ds_balTreas'] !== false ? '' : 'none'}"><span class="lbl">余额</span> <span class="val">${dataMode === 'nodata' ? '-' : '15000'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_balInt" style="display:${dataSourceFieldVisibility['ds_balInt'] !== false ? '' : 'none'}"><span class="lbl">利息</span> <span class="val text-green">${dataMode === 'nodata' ? '-' : '35'}</span></div>
                                </div>
                            </div>
                            <!-- 用户标签 -->
                            <div class="detail-card ds-field" data-ds-id="ds_tags" style="flex: 0 1 auto; width: max-content; display:${dataSourceFieldVisibility['ds_tags'] !== false ? '' : 'none'}">
                                <div class="detail-card-header"><i class="ph ph-tag"></i> 用户标签</div>
                                <div class="detail-card-body" style="display:flex; flex-direction:column; flex-wrap:wrap; align-content:flex-start; gap:8px; max-height: 116px;">
                                    ${(user.tags && user.tags.length > 0) ? user.tags.map(t => `<span class="user-custom-tag tag-blue">${t}</span>`).join('') : '<span style="color:#94a3b8; font-size:13px;">无标签</span>'}
                                </div>
                            </div>
                            <!-- 信贷 -->
                            <div class="detail-card" data-category="信贷" style="flex: 0 0 auto; width: max-content; display: ${drawerCategoryVisibility['信贷'] !== false ? 'block' : 'none'};">
                                <div class="detail-card-header"><i class="ph ph-credit-card"></i> 信贷</div>
                                <div class="detail-card-body flex-list-col">
                                    <div class="ds-field" data-ds-id="ds_debt" style="display:${dataSourceFieldVisibility['ds_debt'] !== false ? '' : 'none'}"><span class="lbl">欠款</span> <span class="val text-red">${formatAmount(user.arrears)}</span></div>
                                    <div class="ds-field" data-ds-id="ds_creditVal" style="display:${dataSourceFieldVisibility['ds_creditVal'] !== false ? '' : 'none'}"><span class="lbl">信用值</span> <span class="val">${formatAmount(user.creditValue)}</span></div>
                                </div>
                            </div>
                        </div>
                        <!-- 其他 (备注等底部信息) -->
                        <div class="detail-card" data-category="其他" style="display: ${drawerCategoryVisibility['其他'] !== false ? 'block' : 'none'}; border: none; box-shadow: none; background: transparent; padding: 0;">
                            <div style="width:100%; border-bottom: 1px dashed #e2e8f0; margin: 16px 0;"></div>
                            <div style="width:100%; display:flex; gap:32px; margin-bottom: 8px; padding: 0 40px;">
                                <div style="display:flex; gap:8px;"><span style="color:#64748b;">备注</span> <span title="${user.remark || ''}">${user.remark ? (user.remark.length > 20 ? user.remark.substring(0, 20) + '...' : user.remark) : '-'}</span></div>
                                <div style="display:flex; gap:8px;"><span style="color:#64748b;">回访备注</span> <span title="${user.followRemark || ''}">${user.followRemark ? (user.followRemark.length > 20 ? user.followRemark.substring(0, 20) + '...' : user.followRemark) : '-'}</span></div>
                            </div>
                        </div>
                    </td>
                `;
                    userTableBody.appendChild(expandTr);
                }
            });

            // Bind Header Columns Toggle Button (Image 2 Icon)
            document.querySelectorAll('.btn-header-columns-toggle').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeAllDropdowns();
                    const columnsDrawer = document.getElementById('columnsDrawer');
                    const customColumnDrawer = document.getElementById('customColumnDrawer');
                    
                    if (currentTableMode === 'nested') {
                        if (customColumnDrawer) {
                            const tableHeader = document.querySelector('#userTable thead th');
                            if (tableHeader) {
                                const rect = tableHeader.getBoundingClientRect();
                                const availableSpace = window.innerHeight - rect.bottom - 10;
                                customColumnDrawer.style.setProperty('--max-drawer-height', `${availableSpace}px`);
                            }
                            customColumnDrawer.classList.add('show');
                            if (typeof renderDrawerStates === 'function') {
                                renderDrawerStates();
                            }
                        }
                    } else {
                        if (columnsDrawer) {
                            tempCompactColumnVisibility = { ...compactColumnVisibility };
                            tempPinnedColumnIds = [...pinnedColumnIds];
                            renderDropdown();
                            columnsDrawer.classList.add('active');
                            if (overlay) overlay.classList.add('active');
                        }
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

                    if (text === '编辑用户' || text === '编辑用户') {
                        if (uid) openUserEditModal(uid);
                    } else if (text === '查看详情' || text === '查看详情') {
                        if (uid) openUserDetailModal(uid);
                    } else {
                        // other menu items: placeholder (no alert)
                    }
                    li.parentElement.classList.remove('show');
                });
            });

            userTableBody.querySelectorAll('.more-op-dropdown-menu li').forEach(li => {
                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const text = li.textContent.trim();
                    alert(`触发操作：${text}`);
                });
            });

            // Bind Expand Row Event
            userTableBody.querySelectorAll('.expand-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const tr = btn.closest('tr');
                    const expandTr = tr.nextElementSibling;
                    if (expandTr && expandTr.classList.contains('expanded-detail-row')) {
                        if (expandTr.style.display === 'none') {
                            expandTr.style.display = 'table-row';
                            btn.classList.remove('ph-caret-right');
                            btn.classList.add('ph-caret-down');
                            btn.style.color = 'var(--primary-color)';
                            tr.style.backgroundColor = '#f8fafc';
                        } else {
                            expandTr.style.display = 'none';
                            btn.classList.remove('ph-caret-down');
                            btn.classList.add('ph-caret-right');
                            btn.style.color = '';
                            tr.style.backgroundColor = '';
                        }
                    }
                });
            });

            // Bind Expand All Event
            const expandAllBtn = document.querySelector('.expand-all-btn');
            if (expandAllBtn) {
                expandAllBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isExpanded = expandAllBtn.classList.contains('ph-caret-down');
                    const expandBtns = userTableBody.querySelectorAll('.expand-btn');

                    if (isExpanded) {
                        expandAllBtn.classList.remove('ph-caret-down');
                        expandAllBtn.classList.add('ph-caret-right');
                        expandAllBtn.style.color = 'var(--text-main)';
                        expandBtns.forEach(btn => {
                            if (btn.classList.contains('ph-caret-down')) btn.click();
                        });
                    } else {
                        expandAllBtn.classList.remove('ph-caret-right');
                        expandAllBtn.classList.add('ph-caret-down');
                        expandAllBtn.style.color = 'var(--primary-color)';
                        expandBtns.forEach(btn => {
                            if (btn.classList.contains('ph-caret-right')) btn.click();
                        });
                    }
                });
            }

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

            // Initialize column resizing
            if (typeof window.setupTableResizing === 'function') {
                window.setupTableResizing();
            }

            // Restore expanded rows
            if (previouslyExpanded.length > 0) {
                previouslyExpanded.forEach(uid => {
                    const btn = userTableBody.querySelector(`.expand-btn[data-uid="${uid}"]`);
                    if (btn) btn.click();
                });
            }
        };

        if (skipDelay) {
            executeRender();
        } else {
            window.renderTableTimeout = setTimeout(executeRender, 400);
        }
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
                        巢状模式栏位
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
                const pinHtml = `<i class="ph ph-push-pin icon-pin ${isPinned ? 'active' : ''}" data-id="${col.id}" title="钉选栏位"></i>`;

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
                        pinHtml = `<i class="ph ph-push-pin icon-pin ${isPinned ? 'active' : ''}" data-id="${col.id}" title="钉选栏位"></i>`;
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
                    tempPinnedColumnIds = [...pinnedColumnIds];
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

        // Update title
        const titleEl = document.getElementById('userEditDrawerTitle');
        if (titleEl) titleEl.textContent = `修改用户详情 · ${user.account}`;

        // Update status badge
        const badge = document.getElementById('ued-status-badge');
        if (badge) {
            badge.className = 'ued-status-badge';
            let statusText = user.status || '正常';
            if (statusText === '正常' || statusText === 'normal') {
                badge.classList.add('ued-status-normal');
                badge.innerHTML = '<span class="ued-status-dot"></span>目前状态：正常';
            } else if (statusText === '冻结' || statusText === '冻结') {
                badge.classList.add('ued-status-frozen');
                badge.innerHTML = '<span class="ued-status-dot"></span>目前状态：冻结';
            } else {
                badge.classList.add('ued-status-disabled');
                badge.innerHTML = '<span class="ued-status-dot"></span>目前状态：停用';
            }
        }

        // Update status radio buttons highlight
        const radioLabels = document.querySelectorAll('#ued-status-radio .ued-radio-btn');
        radioLabels.forEach(l => l.classList.remove('ued-radio-active'));

        // Account
        const accountEl = document.getElementById('editFormAccount');
        if (accountEl) accountEl.value = user.account;

        // Member type
        const memberTypeEl = document.getElementById('editFormMemberType');
        if (memberTypeEl) memberTypeEl.value = user.userType || '代理会员';

        // Status radios
        const statusRadios = document.querySelectorAll('input[name="editStatus"]');
        statusRadios.forEach(r => {
            r.checked = (r.value === (user.status || '正常'));
        });

        // Inputs
        const realNameIn = document.getElementById('editFormRealName');
        if (realNameIn) realNameIn.value = (window.dataMode === 'nodata' || user.realName === '-') ? '-' : user.realName;

        const nicknameIn = document.getElementById('editFormNickname');
        if (nicknameIn) nicknameIn.value = (window.dataMode === 'nodata' || user.nickname === '-') ? '-' : user.nickname;

        const phoneIn = document.getElementById('editFormPhone');
        if (phoneIn) phoneIn.value = (window.dataMode === 'nodata' || user.phone === '未绑定') ? '-' : user.phone;

        const payLevelSel = document.getElementById('editFormPayLevel');
        if (payLevelSel) {
            if (window.dataMode === 'nodata') {
                if (!Array.from(payLevelSel.options).some(o => o.value === '-')) {
                    payLevelSel.add(new Option('-', '-'));
                }
                payLevelSel.value = '-';
            } else {
                payLevelSel.value = user.payLevel || '默认层';
            }
        }

        const levelSel = document.getElementById('editFormLevel');
        if (levelSel) {
            if (window.dataMode === 'nodata') {
                if (!Array.from(levelSel.options).some(o => o.value === '-')) {
                    levelSel.add(new Option('-', '-'));
                }
                levelSel.value = '-';
            } else {
                levelSel.value = user.level || '普通会员';
            }
        }

        const remarkIn = document.getElementById('editFormRemark');
        if (remarkIn) remarkIn.value = (window.dataMode === 'nodata' || user.remark === '-') ? '-' : user.remark;
        
        // Handle extra hardcoded inputs for nodata mode
        if (window.dataMode === 'nodata') {
            const extraInputs = ['editFormEmail', 'editFormQQ', 'editFormWechat', 'editFormZalo', 'editFormWhatsapp', 'editFormTelegram', 'editFormFacebook'];
            extraInputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '-';
            });
            
            // Clear withdraw info content in edit modal
            const withdrawTableBody = document.getElementById('withdrawTableBody');
            if (withdrawTableBody) {
                withdrawTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 32px 0;">-</td></tr>`;
            }
        }

        // Reset to Basic Tab on open
        const basicTabBtn = document.querySelector('.user-edit-tab-item[data-tab="basic"]');
        if (basicTabBtn) basicTabBtn.click();

        userEditDrawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
    }

    /* =========================================================
       查看详情 Drawer Logic
       ========================================================= */
    const userDetailDrawer = document.getElementById('userDetailDrawer');
    const btnUserDetailClose = document.getElementById('btnUserDetailClose');
    
    function openUserDetailModal(uid) {
        if (!userDetailDrawer) return;
        const user = (mockUsers || []).find(u => u.uid === uid) || (mockUsers && mockUsers[0]);
        if (!user) return;

        // Update Title
        const titleEl = document.getElementById('userDetailDrawerTitle');
        if (titleEl) titleEl.textContent = `查看详情 · ${user.account}`;
        
        // Update Status Badge
        const badge = document.getElementById('ued-detail-status-badge');
        if (badge) {
            badge.className = 'ued-status-badge';
            let statusText = user.status || '正常';
            if (statusText === '正常' || statusText === 'normal') {
                badge.classList.add('ued-status-normal');
                badge.innerHTML = '<span class="ued-status-dot"></span>目前状态：正常';
            } else if (statusText === '冻结' || statusText === '冻结') {
                badge.classList.add('ued-status-frozen');
                badge.innerHTML = '<span class="ued-status-dot"></span>目前状态：冻结';
            } else {
                badge.classList.add('ued-status-disabled');
                badge.innerHTML = '<span class="ued-status-dot"></span>目前状态：停用';
            }
        }

        // Apply nodata mock overrides to hardcoded view modal elements
        if (window.dataMode === 'nodata') {
            const readonlyTexts = userDetailDrawer.querySelectorAll('.ued-readonly-text');
            readonlyTexts.forEach(el => {
                // If it doesn't contain an icon (like the avatar does), replace with '-'
                if (!el.querySelector('i')) {
                    el.innerText = '-';
                }
            });
            // Also override unbind boxes if they are hardcoded in the view modal
            const unbindBoxes = userDetailDrawer.querySelectorAll('.ued-binding-box');
            unbindBoxes.forEach(el => el.innerText = '-');

            // Override mockup tables in the detail tabs
            const mockTables = userDetailDrawer.querySelectorAll('.ued-drawer-table tbody td');
            mockTables.forEach(td => {
                // Ignore columns that have buttons (actions) or tags
                if (!td.querySelector('button') && !td.querySelector('.user-custom-tag')) {
                    td.innerText = '-';
                }
            });
            
            // Override mockup grids in Device / IP tab
            const nestedTriggers = userDetailDrawer.querySelectorAll('.nested-trigger');
            nestedTriggers.forEach(el => el.innerText = '-');
            const dataDivs = userDetailDrawer.querySelectorAll('div');
            dataDivs.forEach(div => {
                if (div.innerText.trim() === '54.150.111.152' || div.innerText.includes('ee5868d85af7f68cf088a')) {
                    div.innerHTML = '-';
                }
            });
            
            // Clear withdraw info content in view details modal
            const viewWithdrawTab = document.getElementById('tabContentDtlWithdraw');
            if (viewWithdrawTab) {
                const tbody = viewWithdrawTab.querySelector('tbody');
                if (tbody) {
                    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 32px 0;">-</td></tr>`;
                }
            }
        }

        // Reset to first tab
        const firstTab = document.querySelector('.user-detail-tab-item[data-tab="dtl-info"]');
        if (firstTab) firstTab.click();

        userDetailDrawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
    }

    function closeUserDetailDrawer() {
        if (userDetailDrawer) userDetailDrawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    if (btnUserDetailClose) {
        btnUserDetailClose.addEventListener('click', closeUserDetailDrawer);
    }

    // Detail Tabs
    const userDetailTabs = document.querySelectorAll('.user-detail-tab-item');
    const dtlTabContents = document.querySelectorAll('.dtl-tab-content');

    userDetailTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            userDetailTabs.forEach(t => t.classList.remove('active'));
            dtlTabContents.forEach(c => c.style.display = 'none');
            
            tab.classList.add('active');
            const targetId = 'tabContent' + tab.getAttribute('data-tab').split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });

    // Nested Drill-down Drawer Logic
    const nestedDrawer = document.getElementById('nestedDrilldownDrawer');
    const btnNestedClose = document.getElementById('btnNestedClose');
    const nestedDrawerTitle = document.getElementById('nestedDrawerTitle');
    const nestedTableBody = document.getElementById('nestedTableBody');

    let nestedCurrentSort = 'desc';
    
    function openNestedDrawer(type, val) {
        if (!nestedDrawer) return;
        
        let data = [];
        if (type === 'ip') {
            data = [
                { user: 'megan002', timeHtml: '2026-07-28<br>16:30:42', timeStr: '2026-07-28 16:30:42', col3: '<div style="display:flex; align-items:center; gap:6px;">54.150.111.152 <button class="ued-copy-btn" title="复制" style="color:#94a3b8;"><i class="ph ph-copy"></i></button></div>', col4: '<div style="display:flex; gap:6px;"><i class="ph-fill ph-map-pin" style="color:#94a3b8; margin-top:2px; font-size:16px;"></i> Japan, Tokyo,<br>Tokyo</div>' },
                { user: 'player_888', timeHtml: '2026-07-28<br>15:28:45', timeStr: '2026-07-28 15:28:45', col3: '<div style="display:flex; align-items:center; gap:6px;">54.150.111.152 <button class="ued-copy-btn" title="复制" style="color:#94a3b8;"><i class="ph ph-copy"></i></button></div>', col4: '<div style="display:flex; gap:6px;"><i class="ph-fill ph-map-pin" style="color:#94a3b8; margin-top:2px; font-size:16px;"></i> Japan, Tokyo,<br>Tokyo</div>' },
                { user: 'vip_king99', timeHtml: '2026-07-28<br>14:26:48', timeStr: '2026-07-28 14:26:48', col3: '<div style="display:flex; align-items:center; gap:6px;">54.150.111.152 <button class="ued-copy-btn" title="复制" style="color:#94a3b8;"><i class="ph ph-copy"></i></button></div>', col4: '<div style="display:flex; gap:6px;"><i class="ph-fill ph-map-pin" style="color:#94a3b8; margin-top:2px; font-size:16px;"></i> Japan, Tokyo,<br>Tokyo</div>' }
            ];
        } else {
            data = [
                { user: 'megan002', timeHtml: '2026-05-10<br>10:12:00', timeStr: '2026-05-10 10:12:00', col3: '<div style="display:flex; align-items:center; gap:6px;">ee5868d85af7f68cf088a... <button class="ued-copy-btn" title="复制" style="color:#94a3b8;"><i class="ph ph-copy"></i></button></div>', col4: '<div style="display:flex; gap:6px;"><i class="ph-fill ph-map-pin" style="color:#94a3b8; margin-top:2px; font-size:16px;"></i> Japan, Tokyo,<br>Tokyo</div>' },
                { user: 'sub_acc_01', timeHtml: '2026-06-12<br>09:15:30', timeStr: '2026-06-12 09:15:30', col3: '<div style="display:flex; align-items:center; gap:6px;">ee5868d85af7f68cf088a... <button class="ued-copy-btn" title="复制" style="color:#94a3b8;"><i class="ph ph-copy"></i></button></div>', col4: '<div style="display:flex; gap:6px;"><i class="ph-fill ph-map-pin" style="color:#94a3b8; margin-top:2px; font-size:16px;"></i> Japan, Osaka</div>' },
                { user: 'sub_acc_02', timeHtml: '2026-06-18<br>11:04:12', timeStr: '2026-06-18 11:04:12', col3: '<div style="display:flex; align-items:center; gap:6px;">ee5868d85af7f68cf088a... <button class="ued-copy-btn" title="复制" style="color:#94a3b8;"><i class="ph ph-copy"></i></button></div>', col4: '<div style="display:flex; gap:6px;"><i class="ph-fill ph-map-pin" style="color:#94a3b8; margin-top:2px; font-size:16px;"></i> Japan, Tokyo</div>' }
            ];
        }

        const thead = document.getElementById('nestedTableHeader');
        if (thead) {
            const col3Label = type === 'ip' ? 'IP' : '设备号';
            thead.innerHTML = `
                <tr>
                    <th style="padding: 16px 24px; color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">登录用户</th>
                    <th style="padding: 16px 24px; color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">
                        <div id="nestedSortTimeBtn" style="display:flex; align-items:center; gap:4px; cursor:pointer; user-select:none;">
                            最后登录时间 <i class="ph ph-caret-up-down" style="color: #94a3b8;"></i>
                        </div>
                    </th>
                    <th style="padding: 16px 24px; color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${col3Label}</th>
                    <th style="padding: 16px 24px; color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">IP信息</th>
                </tr>
            `;

            // Bind sort event
            const sortBtn = document.getElementById('nestedSortTimeBtn');
            if (sortBtn) {
                sortBtn.addEventListener('click', () => {
                    nestedCurrentSort = nestedCurrentSort === 'desc' ? 'asc' : 'desc';
                    renderTable();
                });
            }
        }

        function renderTable() {
            if (!nestedTableBody) return;
            
            // Sort data array
            data.sort((a, b) => {
                const timeA = new Date(a.timeStr).getTime();
                const timeB = new Date(b.timeStr).getTime();
                return nestedCurrentSort === 'asc' ? timeA - timeB : timeB - timeA;
            });

            // Re-render
            nestedTableBody.innerHTML = data.map(row => `
                <tr>
                    <td style="padding: 16px 24px; font-weight: 500; color: #1e293b;">${row.user}</td>
                    <td style="padding: 16px 24px; font-weight: 500; color: #1e293b;">${row.timeHtml}</td>
                    <td style="padding: 16px 24px; font-weight: 500; color: #64748b;">${row.col3}</td>
                    <td style="padding: 16px 24px; font-weight: 500; color: #64748b;">${row.col4}</td>
                </tr>
            `).join('');
        }

        // Initial render
        renderTable();
        
        nestedDrawer.classList.add('active');
        if (userDetailDrawer) {
            userDetailDrawer.classList.add('shifted');
        }
        document.body.classList.add('has-nested-open');
    }

    function closeNestedDrawer() {
        if (nestedDrawer) nestedDrawer.classList.remove('active');
        if (userDetailDrawer) userDetailDrawer.classList.remove('shifted');
        document.body.classList.remove('has-nested-open');
    }

    if (btnNestedClose) btnNestedClose.addEventListener('click', closeNestedDrawer);

    document.addEventListener('click', (e) => {
        const nestedTrigger = e.target.closest('.nested-trigger');
        if (nestedTrigger) {
            e.preventDefault();
            const type = nestedTrigger.getAttribute('data-type');
            const val = nestedTrigger.getAttribute('data-val');
            openNestedDrawer(type, val);
        }
    });

    function closeUserEditDrawer() {
        if (userEditDrawer) userEditDrawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    // Expose to global scope for inline onclick
    window._openUserEditModalGlobal = openUserEditModal;

    // Delegated click listener for user links

    document.addEventListener('click', (e) => {
        // Ignored if it's nested trigger, handled above
        if (e.target.closest('.nested-trigger')) return;

        const link = e.target.closest('.user-detail-link');
        if (link) {
            e.preventDefault();
            const uid = link.getAttribute('data-uid');
            const text = link.textContent.trim();
            
            if (text === '查看详情' || text === '查看详情') {
                openUserDetailModal(uid);
            } else if (text === '编辑用户' || text === '编辑用户') {
                openUserEditModal(uid);
            } else {
                // Fallback for general links (like the username column)
                if (link.closest('#nestedDrilldownDrawer')) {
                    openUserDetailModal(uid);
                } else {
                    openUserEditModal(uid);
                }
            }
        }

        const subLink = e.target.closest('.subordinate-link');
        if (subLink) {
            e.preventDefault();
            showToast('即将跳转至团队页面...');
        }
    });

    if (btnUserEditClose) btnUserEditClose.addEventListener('click', closeUserEditDrawer);
    if (btnUserEditCancel) btnUserEditCancel.addEventListener('click', closeUserEditDrawer);
    if (btnUserEditSave) {
        btnUserEditSave.addEventListener('click', () => {
            showToast('用户详情已更新！');
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
    document.querySelector('#userTableBody')?.addEventListener('click', function (e) {
        if (e.target.closest('.ip-link')) {
            e.preventDefault();
            const ip = e.target.closest('.ip-link').dataset.ip;
            showToast('前往 IP 统计页面: ' + ip);
        }

        if (e.target.closest('.copy-ip-btn')) {
            const ip = e.target.closest('.copy-ip-btn').dataset.ip;
            navigator.clipboard.writeText(ip).then(() => {
                showToast('已复制 IP: ' + ip);
            }).catch(err => {
                showToast('复制失败');
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
                showToast('三方余额刷新成功');
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
            nestedPinnedColumnIds = [...tempNestedPinnedColumnIds];
        } else {
            compactColumnVisibility = { ...tempCompactColumnVisibility };
            pinnedColumnIds = [...tempPinnedColumnIds];
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
            const actionClassMap = {
                '编辑用户': 'action-edit-user', '查看详情': 'action-view-details', '额度修改': 'action-edit-balance',
                '资金明细': 'action-fund-detail', '注单明细': 'action-bet-detail', '修改密码': 'action-edit-password',
                '下级会员': 'action-sub-member', '下级报表': 'action-sub-report', '下级注单': 'action-sub-bet',
                '交易设定': 'action-trade-setting', '代理变更': 'action-edit-proxy',
                '第三方游戏': 'action-third-game', '积分修改': 'action-edit-point',
                '稽核记录': 'action-audit-record', '代理变更记录': 'action-proxy-record',
                '隐藏资金明细': 'action-hide-fund', '快速登录变更': 'action-fast-login',
                '谷歌验证码': 'action-google-auth',
                '赔率设置': 'action-odds-setting', '校验用户任务': 'action-verify-task',
                '链上地址': 'action-chain-address', '额度修改(链上充值)': 'action-edit-balance-chain',
                '编辑标签': 'action-edit-tag', '用户标签编辑纪录': 'action-tag-record', '用户标签编辑记录': 'action-tag-record',
                '回访备注': 'action-follow-remark'
            };
            const actionClass = actionClassMap[item] || '';
            return `<a href="#" class="${actionClass}" style="display:block;padding:8px 16px;color:#374151;text-decoration:none;font-size:13px;text-align:center;" onmouseover="this.style.backgroundColor='#f3f4f6';this.style.color='#3b82f6'" onmouseout="this.style.backgroundColor='transparent';this.style.color='#374151'">${item}</a>`;
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
    // Table Column Resizing Logic
    let isResizing = false;
    let currentTh = null;
    let startX = 0;
    let startWidth = 0;

    function initTableResizing() {
        const table = document.getElementById('userTable');
        if (!table) return;
        const resizers = table.querySelectorAll('.resizer');
        resizers.forEach(resizer => {
            if (resizer.dataset.bound) return;
            resizer.dataset.bound = '1';
            resizer.addEventListener('mousedown', function (e) {
                isResizing = true;
                currentTh = e.target.closest('th');
                startX = e.pageX;
                startWidth = currentTh.offsetWidth;
                e.target.classList.add('resizing');
                document.body.style.cursor = 'col-resize';
                e.preventDefault();
                e.stopPropagation();
            });
        });
    }

    document.addEventListener('mousemove', function (e) {
        if (!isResizing || !currentTh) return;
        const diff = e.pageX - startX;
        let newWidth = startWidth + diff;
        if (newWidth < 60) newWidth = 60;
        currentTh.style.minWidth = newWidth + 'px';
        currentTh.style.width = newWidth + 'px';
        currentTh.style.maxWidth = newWidth + 'px';

        if (currentTh.classList.contains('sticky-col')) {
            updateStickyPositions();
        }
    });

    document.addEventListener('mouseup', function (e) {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.querySelectorAll('.resizing').forEach(r => r.classList.remove('resizing'));
            currentTh = null;
        }
    });

    function updateStickyPositions() {
        const table = document.getElementById('userTable');
        if (!table) return;
        const headers = Array.from(table.querySelectorAll('thead th.sticky-col'));
        let currentLeft = 0;
        const leftOffsets = [];
        headers.forEach(th => {
            leftOffsets.push(currentLeft);
            th.style.left = currentLeft + 'px';
            currentLeft += th.offsetWidth;
        });

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const tds = row.querySelectorAll('td.sticky-col');
            tds.forEach((td, i) => {
                if (leftOffsets[i] !== undefined) {
                    td.style.left = leftOffsets[i] + 'px';
                }
            });
        });
    }

    window.setupTableResizing = initTableResizing;

    // --- Custom Column Drawer Logic ---
    const btnCustomColumns = document.getElementById('btnCustomColumns');
    const customColumnDrawer = document.getElementById('customColumnDrawer');
    const btnToggleDrawerHeight = document.getElementById('btnToggleDrawerHeight');
    const btnCloseCustomColumnDrawer = document.getElementById('btnCloseCustomColumnDrawer');
    const frozenColumnsList = document.getElementById('frozenColumnsList');
    const scrollColumnsList = document.getElementById('scrollColumnsList');
    const dataSourceGrid = document.getElementById('dataSourceGrid');

    let nestedFrozenColumns = [
        { id: 'memberInfo', label: '会员信息', isNative: true },
        { id: 'levelTeam', label: '等级&团队', isNative: true }
    ];
    let nestedScrollColumns = [
        { id: 'online', label: '在线', isNative: true },
        { id: 'avatar', label: '头像', isNative: true },
        { id: 'creditLimit', label: '信用&额度', isNative: true },
        { id: 'depositWithdraw', label: '存取款', isNative: true },
        { id: 'tags', label: '标签', isNative: true },
        { id: 'status', label: '状态', isNative: true }
    ];
    let compactFrozenColumns = [];
    let compactScrollColumns = [];
    
    // Initialize compact drawer columns from the original config
    compactColumnsConfig.forEach(col => {
        col.isNative = true;
        if (pinnedColumnIds.includes(col.id)) {
            compactFrozenColumns.push(col);
        } else {
            compactScrollColumns.push(col);
        }
    });

    const getActiveLists = () => {
        return {
            frozen: currentTableMode === 'nested' ? nestedFrozenColumns : compactFrozenColumns,
            scroll: currentTableMode === 'nested' ? nestedScrollColumns : compactScrollColumns
        };
    };
    let availableDataSource = [
        { id: 'ds_realname', label: '真实姓名', category: '基本资料' },
        { id: 'ds_birthday', label: '生日', category: '基本资料' },
        { id: 'ds_accountType', label: '帐号类型', category: '基本资料' },
        { id: 'ds_memberType', label: '会员类型', category: '基本资料' },
        { id: 'ds_level', label: '等级', category: '基本资料' },
        { id: 'ds_regMode', label: '注册模式', category: '基本资料' },
        { id: 'ds_nickname', label: '暱称', category: '基本资料' },
        { id: 'ds_phone', label: '手机号', category: '基本资料' },
        { id: 'ds_depTotal', label: '存款总额', category: '资金与存取款' },
        { id: 'ds_depCount', label: '存款次数', category: '资金与存取款' },
        { id: 'ds_wdrTotal', label: '取款总额', category: '资金与存取款' },
        { id: 'ds_wdrCount', label: '取款次数', category: '资金与存取款' },
        { id: 'ds_wdrFee', label: '提款预扣金额', category: '资金与存取款' },
        { id: 'ds_sysAdd', label: '后台加款总额', category: '资金与存取款' },
        { id: 'ds_sysSub', label: '后台扣款总额', category: '资金与存取款' },
        { id: 'ds_growth', label: '成长值', category: '成长与积分' },
        { id: 'ds_vipGrowth', label: 'VIP成长值', category: '成长与积分' },
        { id: 'ds_points', label: '会员积分', category: '成长与积分' },
        { id: 'ds_inviter', label: '邀请人', category: '推荐关系' },
        { id: 'ds_inviteCode', label: '邀请码', category: '推荐关系' },
        { id: 'ds_team', label: '下级/团队', category: '推荐关系' },
        { id: 'ds_commBal', label: '佣金余额', category: '推荐关系' },
        { id: 'ds_balTreas', label: '余额', category: '余额宝' },
        { id: 'ds_balInt', label: '利息', category: '余额宝' },
        { id: 'ds_debt', label: '欠款', category: '信贷' },
        { id: 'ds_creditVal', label: '信用值', category: '信贷' },
        { id: 'ds_tags', label: '用户标签', category: '其他' },
        { id: 'ds_remark', label: '备注', category: '其他' },
        { id: 'ds_followup', label: '回访备注', category: '其他' }
    ];

    // Track which data source fields are visible in expanded cards (true=visible, false=hidden)
    let dataSourceFieldVisibility = {};

    window.toggleDataSourceFieldVisibility = function(id) {
        dataSourceFieldVisibility[id] = dataSourceFieldVisibility[id] === false ? true : false;
        // Update all expanded row cards in the DOM directly
        document.querySelectorAll(`.ds-field[data-ds-id="${id}"]`).forEach(el => {
            el.style.display = dataSourceFieldVisibility[id] === false ? 'none' : '';
        });
        renderDrawerStates();
    };

    window.resetCustomColumns = function() {
        if (!confirm('确定要重置所有自订栏位设定吗？')) return;
        // Reset data source visibility
        dataSourceFieldVisibility = {};
        drawerCategoryVisibility = { '信贷': false };
        renderDrawerStates();
        // Update all visible expanded rows
        document.querySelectorAll('.ds-field').forEach(el => {
            el.style.display = '';
        });
        document.querySelectorAll('.detail-card[data-category="信贷"]').forEach(card => {
            card.style.display = 'none';
        });
    };

    if (btnCustomColumns && customColumnDrawer) {
        btnCustomColumns.addEventListener('click', () => {
            const tableHeader = document.querySelector('#userTable thead th');
            if (tableHeader) {
                const rect = tableHeader.getBoundingClientRect();
                const availableSpace = window.innerHeight - rect.bottom - 10;
                customColumnDrawer.style.setProperty('--max-drawer-height', `${availableSpace}px`);
            }
            customColumnDrawer.classList.add('show');
            renderDrawerStates();
        });

        btnCloseCustomColumnDrawer.addEventListener('click', () => {
            customColumnDrawer.classList.remove('show');
            customColumnDrawer.classList.remove('expanded');
        });

        btnToggleDrawerHeight.addEventListener('click', () => {
            if (!customColumnDrawer.classList.contains('expanded')) {
                // Compute max available height below table header by targeting a sticky <th>
                const tableHeader = document.querySelector('#userTable thead th');
                if (tableHeader) {
                    const rect = tableHeader.getBoundingClientRect();
                    // Leave a 10px margin below the header
                    const availableSpace = window.innerHeight - rect.bottom - 10;
                    customColumnDrawer.style.setProperty('--max-drawer-height', `${availableSpace}px`);
                }
                customColumnDrawer.classList.add('expanded');
            } else {
                customColumnDrawer.classList.remove('expanded');
            }
        });
    }

    function renderDrawerStates() {
        if (!frozenColumnsList || !scrollColumnsList || !dataSourceGrid) return;

        frozenColumnsList.innerHTML = '';
        scrollColumnsList.innerHTML = '';
        dataSourceGrid.innerHTML = '';

        const activeLists = getActiveLists();

        activeLists.frozen.forEach((col, idx) => {
            frozenColumnsList.appendChild(createColumnItem(col, idx, 'frozen'));
        });

        activeLists.scroll.forEach((col, idx) => {
            scrollColumnsList.appendChild(createColumnItem(col, idx, 'scroll'));
        });

        const groupedSource = {};
        availableDataSource.forEach((col) => {
            const cat = col.category || '其他';
            if (!groupedSource[cat]) groupedSource[cat] = [];
            groupedSource[cat].push(col);
        });

        for (const cat in groupedSource) {
            const block = document.createElement('div');
            block.className = 'category-block';
            block.style.marginBottom = '24px';
            
            const isVisible = drawerCategoryVisibility[cat] !== false;
            
            block.innerHTML = `
                <div class="category-title" style="font-size:13px; font-weight:600; color:var(--text-muted); margin-bottom:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;" onclick="window.toggleCategoryVisibility('${cat}')">
                    <div style="display:flex; align-items:center; gap:6px;">
                        <i class="ph-fill ph-folder-notch" style="color:var(--primary-color);"></i>${cat}
                    </div>
                    <button type="button" class="btn-action-icon" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer;">
                        <i class="ph ${isVisible ? 'ph-eye' : 'ph-eye-slash'}"></i>
                    </button>
                </div>
            `;
            const grid = document.createElement('div');
            grid.className = 'auto-fit-grid';
            groupedSource[cat].forEach(col => {
                grid.appendChild(createDataCard(col));
            });
            block.appendChild(grid);
            dataSourceGrid.appendChild(block);
        }

        initDragAndDrop();
        updateTableFromDrawer();
    }

    function createColumnItem(col, index, type) {
        const div = document.createElement('div');
        div.className = 'column-item';
        div.draggable = true;
        div.dataset.id = col.id;
        div.dataset.type = type;

        const isNative = col.isNative === true;
        let actionButtons = '';
        
        actionButtons += `<button type="button" class="btn-action-icon" onclick="window.moveColumnUp('${col.id}', '${type}')" ${index === 0 ? 'disabled style="opacity: 0.5;"' : ''}><i class="ph ph-arrow-up"></i></button>`;
        actionButtons += `<button type="button" class="btn-action-icon" onclick="window.moveColumnDown('${col.id}', '${type}')"><i class="ph ph-arrow-down"></i></button>`;
        actionButtons += `<button type="button" class="btn-action-icon lock-btn ${type === 'frozen' ? 'locked' : ''}" onclick="window.toggleLock('${col.id}', '${type}')"><i class="ph ${type === 'frozen' ? 'ph-lock-key' : 'ph-lock-key-open'}"></i></button>`;
        
        if (!isNative) {
            actionButtons += `<button type="button" class="btn-action-icon delete-btn" onclick="window.demoteColumn('${col.id}', '${type}')"><i class="ph ph-trash"></i></button>`;
        }

        const isVisible = currentTableMode === 'nested' ? nestedColumnVisibility[col.id] !== false : compactColumnVisibility[col.id] !== false;
        const isMandatory = ['uid', 'account', 'memberInfo'].includes(col.id);
        
        let checkboxHtml = '';
        if (isMandatory) {
            checkboxHtml = `<input type="checkbox" checked disabled class="column-vis-cb" style="cursor: not-allowed;" title="此为必填栏位，无法隐藏">`;
        } else {
            checkboxHtml = `<input type="checkbox" ${isVisible ? 'checked' : ''} class="column-vis-cb" style="cursor: pointer;" onclick="event.stopPropagation(); window.toggleDrawerColumnVisibility('${col.id}')">`;
        }

        div.innerHTML = `
            <div class="column-item-left">
                ${checkboxHtml}
                <span class="column-name">${col.label}</span>
            </div>
            <div class="column-item-actions">
                ${actionButtons}
            </div>
        `;
        return div;
    }

    window.toggleDrawerColumnVisibility = function(id) {
        if (currentTableMode === 'nested') {
            nestedColumnVisibility[id] = !nestedColumnVisibility[id];
        } else {
            compactColumnVisibility[id] = !compactColumnVisibility[id];
        }
        renderDrawerStates();
        updateTableFromDrawer();
    };

    function createDataCard(col) {
        const div = document.createElement('div');
        div.className = 'data-card';
        const isVisible = dataSourceFieldVisibility[col.id] !== false;
        div.innerHTML = `
            <span class="column-name">${col.label}</span>
            <div style="display:flex; gap:2px; align-items:center;">
                <button type="button" class="btn-action-icon eye-btn" onclick="window.toggleDataSourceFieldVisibility('${col.id}')" title="${isVisible ? '隐藏' : '显示'}展开卡片中此栏位"><i class="ph ${isVisible ? 'ph-eye' : 'ph-eye-slash'}"></i></button>
                <button type="button" class="btn-action-icon add-btn" onclick="window.promoteColumn('${col.id}')" title="加入表格"><i class="ph ph-plus"></i></button>
            </div>
        `;
        return div;
    }

    window.promoteColumn = function(id) {
        const idx = availableDataSource.findIndex(c => c.id === id);
        if (idx > -1) {
            const col = availableDataSource.splice(idx, 1)[0];
            col.isNative = false;
            
            if (currentTableMode === 'nested') {
                nestedScrollColumns.push(col);
                nestedColumnVisibility[col.id] = true;
            } else {
                if (!col.render) {
                    col.render = (user) => `<td class="cell-val" data-col="${col.id}">${user[col.id] !== undefined ? user[col.id] : '-'}</td>`;
                }
                col.sortable = false;
                compactScrollColumns.push(col);
                compactColumnVisibility[col.id] = true;
            }
            
            renderDrawerStates();
            updateTableFromDrawer();
        }
    };

    window.demoteColumn = function(id, type) {
        const list = type === 'frozen' ? getActiveLists().frozen : getActiveLists().scroll;
        const idx = list.findIndex(c => c.id === id);
        if (idx > -1) {
            const col = list.splice(idx, 1)[0];
            availableDataSource.push(col);
            renderDrawerStates();
            updateTableFromDrawer();
        }
    };

    window.toggleLock = function(id, type) {
        let sourceList = type === 'frozen' ? getActiveLists().frozen : getActiveLists().scroll;
        let targetList = type === 'frozen' ? getActiveLists().scroll : getActiveLists().frozen;
        const idx = sourceList.findIndex(c => c.id === id);
        if (idx > -1) {
            const col = sourceList.splice(idx, 1)[0];
            targetList.push(col);
            renderDrawerStates();
            updateTableFromDrawer();
        }
    };

    window.moveColumnUp = function(id, type) {
        let list = type === 'frozen' ? getActiveLists().frozen : getActiveLists().scroll;
        const idx = list.findIndex(c => c.id === id);
        if (idx > 0) {
            const temp = list[idx - 1];
            list[idx - 1] = list[idx];
            list[idx] = temp;
            renderDrawerStates();
            updateTableFromDrawer();
        }
    };

    window.moveColumnDown = function(id, type) {
        let list = type === 'frozen' ? getActiveLists().frozen : getActiveLists().scroll;
        const idx = list.findIndex(c => c.id === id);
        if (idx > -1 && idx < list.length - 1) {
            const temp = list[idx + 1];
            list[idx + 1] = list[idx];
            list[idx] = temp;
            renderDrawerStates();
            updateTableFromDrawer();
        }
    };

    let draggedItem = null;

    function initDragAndDrop() {
        const items = document.querySelectorAll('.column-item');
        const zones = document.querySelectorAll('.sortable-list');

        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedItem = item;
                setTimeout(() => item.style.display = 'none', 0);
            });

            item.addEventListener('dragend', () => {
                setTimeout(() => {
                    if (draggedItem) draggedItem.style.display = 'flex';
                    draggedItem = null;
                    updateListsFromDOM();
                }, 0);
            });
        });

        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = getDragAfterElement(zone, e.clientY);
                if (afterElement == null) {
                    zone.appendChild(draggedItem);
                } else {
                    zone.insertBefore(draggedItem, afterElement);
                }
            });
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.column-item:not([style*="display: none"])')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function updateListsFromDOM() {
        const newFrozen = [];
        const newScroll = [];
        
        document.querySelectorAll('#frozenColumnsList .column-item').forEach(el => {
            const id = el.dataset.id;
            let col = customFrozenColumns.find(c => c.id === id) || customScrollColumns.find(c => c.id === id);
            if (col) newFrozen.push(col);
        });

        document.querySelectorAll('#scrollColumnsList .column-item').forEach(el => {
            const id = el.dataset.id;
            let col = customFrozenColumns.find(c => c.id === id) || customScrollColumns.find(c => c.id === id);
            if (col) newScroll.push(col);
        });

        customFrozenColumns = newFrozen;
        customScrollColumns = newScroll;
        renderDrawerStates();
    }

    function updateTableFromDrawer() {
        if (currentTableMode === 'nested') {
            nestedColumnsConfig.length = 0;
            nestedPinnedColumnIds.length = 0;
            
            nestedFrozenColumns.forEach(c => {
                nestedColumnsConfig.push(c);
                nestedPinnedColumnIds.push(c.id);
            });
            
            nestedScrollColumns.forEach(c => {
                nestedColumnsConfig.push(c);
            });

            availableDataSource.forEach(c => {
                nestedColumnVisibility[c.id] = false;
            });
        } else {
            compactColumnsConfig.length = 0;
            pinnedColumnIds.length = 0;
            
            compactFrozenColumns.forEach(c => {
                compactColumnsConfig.push(c);
                pinnedColumnIds.push(c.id);
            });
            
            compactScrollColumns.forEach(c => {
                compactColumnsConfig.push(c);
            });

            availableDataSource.forEach(c => {
                compactColumnVisibility[c.id] = false;
            });
        }

        // Trigger table render if function exists
        if (typeof renderTable === 'function') {
            renderTable(true);
        }
    }

    // Withdrawal Info Add logic
    const btnAddWithdraw = document.getElementById('btnAddWithdraw');
    const withdrawTableBody = document.getElementById('withdrawTableBody');
    if (btnAddWithdraw && withdrawTableBody) {
        btnAddWithdraw.addEventListener('click', () => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><select class="ued-select-sm"><option>请选择</option><option>银行卡</option><option>支付宝</option><option>虚拟币</option><option>ewallet</option></select></td>
                <td><input type="text" class="ued-input-sm" value=""></td>
                <td>
                    <select class="ued-select-sm"><option>请选择</option><option>中国工商银行</option><option>USDT / USD</option></select>
                </td>
                <td><input type="text" class="ued-input-sm" value=""></td>
                <td class="ued-withdraw-actions">
                    <button class="ued-action-del">删除</button>
                    <button class="ued-action-save">储存</button>
                </td>
                <td>
                    <label class="ued-toggle-switch ued-withdraw-toggle">
                        <input type="checkbox">
                        <span class="ued-toggle-thumb"></span>
                    </label>
                </td>
            `;
            withdrawTableBody.appendChild(tr);
        });

        // Event delegation for delete and save actions
        withdrawTableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('ued-action-del')) {
                if (window.confirm("你确定要提交吗？")) {
                    const tr = e.target.closest('tr');
                    if (tr) tr.remove();
                }
            } else if (e.target.classList.contains('ued-action-save')) {
                window.confirm("你确定要提交吗？");
            }
        });

        // Event delegation for toggle disable/enable action
        withdrawTableBody.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.closest('.ued-withdraw-toggle')) {
                if (e.target.checked) {
                    // Attempting to disable (switch turned to the right)
                    if (window.confirm("你确定要提交吗？")) {
                        showToast("提现信息已被禁用成功");
                    } else {
                        // Revert check state (cancel disable)
                        e.target.checked = false;
                    }
                } else {
                    // Attempting to enable (switch turned to the left)
                    if (window.confirm("你确定要提交吗？")) {
                        showToast("提现信息已被启用成功");
                    } else {
                        // Revert check state (cancel enable)
                        e.target.checked = true;
                    }
                }
            }
        });

        // Event delegation for Member Settings toggles
        const settingsTab = document.getElementById('tabContentSettings');
        if (settingsTab) {
            settingsTab.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox' && e.target.closest('.ued-toggle-switch')) {
                    if (e.target.checked) {
                        if (window.confirm("你确定要提交吗？")) {
                            showToast("设置已开启成功");
                        } else {
                            e.target.checked = false;
                        }
                    } else {
                        if (window.confirm("你确定要提交吗？")) {
                            showToast("设置已关闭成功");
                        } else {
                            e.target.checked = true;
                        }
                    }
                }
            });
        }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#334155';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '8px';
        toast.style.fontSize = '14px';
        toast.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        document.body.appendChild(toast);
        
        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

});