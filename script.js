document.addEventListener('DOMContentLoaded', () => {
    let tableFieldVisibility = {};
    window.toggleTableFieldVisibility = function (id, isVisible) {
        tableFieldVisibility[id] = isVisible;
        renderDrawerStates();
        window.applyDrawerOrderToTable();
    };
    let drawerCategoryOrder = ['基本资料', '存取款资料', '成长与积分', '推荐关系', '余额宝', '信贷', '用户标签', '其他'];
    let drawerCategoryVisibility = { '信贷': false };

    window.moveCategoryUp = function (cat) {
        const idx = drawerCategoryOrder.indexOf(cat);
        if (idx > 0) {
            const temp = drawerCategoryOrder[idx - 1];
            drawerCategoryOrder[idx - 1] = drawerCategoryOrder[idx];
            drawerCategoryOrder[idx] = temp;
            renderDrawerStates();
            window.applyDrawerOrderToTable();
        }
    };

    window.moveCategoryDown = function (cat) {
        const idx = drawerCategoryOrder.indexOf(cat);
        if (idx > -1 && idx < drawerCategoryOrder.length - 1) {
            const temp = drawerCategoryOrder[idx + 1];
            drawerCategoryOrder[idx + 1] = drawerCategoryOrder[idx];
            drawerCategoryOrder[idx] = temp;
            renderDrawerStates();
            window.applyDrawerOrderToTable();
        }
    };

    window.applyDrawerOrderToTable = function () {
        document.querySelectorAll('.expanded-detail-row').forEach(row => {
            const wrapper = row.querySelector('.detail-cards-wrapper');
            if (wrapper) {
                const cards = Array.from(wrapper.querySelectorAll('.detail-card[data-category]'));
                cards.sort((a, b) => {
                    const catA = a.getAttribute('data-category');
                    const catB = b.getAttribute('data-category');
                    let idxA = drawerCategoryOrder.indexOf(catA);
                    let idxB = drawerCategoryOrder.indexOf(catB);
                    if (idxA === -1) idxA = 999;
                    if (idxB === -1) idxB = 999;
                    return idxA - idxB;
                });
                cards.forEach(card => wrapper.appendChild(card));

                const activeLists = typeof getActiveLists === 'function' ? getActiveLists() : { frozen: [], scroll: [] };

                cards.forEach(card => {
                    const cat = card.getAttribute('data-category');
                    if (card.classList.contains('ds-field')) {
                        const dsId = card.getAttribute('data-ds-id');
                        const isCol1 = activeLists.frozen.some(c => c.id === dsId) || activeLists.scroll.some(c => c.id === dsId);
                        const isVisible = dataSourceFieldVisibility[dsId] !== false && !isCol1;
                        card.style.display = isVisible ? '' : 'none';
                    } else {
                        const body = card.querySelector('.detail-card-body');
                        if (body && !body.hasAttribute('data-no-sort')) {
                            const fields = Array.from(body.querySelectorAll('.ds-field[data-ds-id]'));
                            fields.sort((a, b) => {
                                const idA = a.getAttribute('data-ds-id');
                                const idB = b.getAttribute('data-ds-id');
                                let idxA = availableDataSource.findIndex(c => c.id === idA);
                                let idxB = availableDataSource.findIndex(c => c.id === idB);
                                if (idxA === -1) idxA = 999;
                                if (idxB === -1) idxB = 999;
                                return idxA - idxB;
                            });

                            let hasVisibleField = false;
                            fields.forEach(f => {
                                body.appendChild(f);
                                const dsId = f.getAttribute('data-ds-id');
                                const isCol1 = activeLists.frozen.some(c => c.id === dsId) || activeLists.scroll.some(c => c.id === dsId);
                                const isVisible = dataSourceFieldVisibility[dsId] !== false && !isCol1;

                                if (isVisible) {
                                    f.style.display = f.style.gap ? 'flex' : '';
                                    hasVisibleField = true;
                                } else {
                                    f.style.display = 'none';
                                }
                            });

                            if (!hasVisibleField) {
                                card.style.display = 'none';
                            } else {
                                card.style.display = 'block';
                            }
                        }
                    }
                });
            }
        });
    };

    window.toggleCategoryVisibility = function (cat) {
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
            window.applyDrawerOrderToTable();
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
    const dropdownCurrency = document.getElementById('dropdownCurrency');
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
                        inputAccount.placeholder = '请输入精确账号';
                    } else if (value === 'fuzzy') {
                        inputAccount.placeholder = '请输入模糊账号关键字';
                    } else if (value === 'multi') {
                        inputAccount.placeholder = "账号以';'隔开，上限限制 50 个账号";
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
    let selectedCurrencyVal = '';
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

    if (typeof dropdownCurrency !== 'undefined' && dropdownCurrency) {
        initSingleSelect(dropdownCurrency, (val) => {
            selectedCurrencyVal = val;
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
            'dropdownStatus', 'dropdownLevel', 'dropdownVip', 'dropdownCurrency', 'dropdownUserTags',
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
                            options[0].click(); // Select the first option for account type (账号精确匹配)
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

        if (statYuEBao) statYuEBao.innerText = '9,999,999,999,999.99';
        if (statTotalAmount) statTotalAmount.innerText = '9,999,999,999,999.99';
        if (statThirdParty) statThirdParty.innerText = '9,999,999,999,999.99';
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
            'dropdownStatus', 'dropdownLevel', 'dropdownVip', 'dropdownCurrency', 'dropdownUserTags',
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
    document.getElementById('btnColumnsDrawerCloseX')?.addEventListener('click', closeDrawer);

    document.addEventListener('click', (e) => {
        const columnsDrawer = document.getElementById('columnsDrawer');
        if (columnsDrawer && columnsDrawer.classList.contains('active')) {
            if (!columnsDrawer.contains(e.target) && !e.target.closest('.btn-header-columns-toggle')) {
                columnsDrawer.classList.remove('active');
            }
        }
    });

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
        { id: 'avatar', label: '头像' },
        { id: 'memberInfo', label: '会员信息' },
        { id: 'levelTeam', label: '等级&团队' },
        { id: 'creditLimit', label: '信用&额度 (主钱包)' },
        { id: 'depositWithdraw', label: '存取款 (主钱包)' },
        { id: 'dwSummary', label: '存取款 (汇总 USDT)' },
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
    function formatAmount(val, currency) {
        if (window.dataMode === 'nodata') return '-';
        if (val === undefined || val === null || val === '-' || val === '' || val === '无数据' || val === '获取失败') return '-';
        let num = parseFloat(val);
        if (isNaN(num)) return '-';

        if (currency === 'USDT') {
            return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
            return Math.floor(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }
    }

    // --- Data State Rendering Helper ---
    function renderDataState(val, type = 'text') {
        if (window.dataMode === 'nodata' || val === '-' || val === null || val === undefined || val === '' || val === '无数据') {
            if (type === 'na') {
                return `<span class="data-na">N/A</span>`;
            }
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
            return `<a href="#" class="ip-link" data-ip="${val}" style="color: var(--primary-color); text-decoration: none;">${val}</a> <i class="ph ph-copy copy-ip-btn" data-ip="${val}" style="cursor: pointer; color: var(--text-muted);" title="复制IP"></i> <i class="ph ph-link ip-link-icon" data-ip="${val}" style="cursor: pointer; color: #3b82f6; margin-left: 4px;" title="前往IP统计页面"></i>`;
        }

        return val;
    }


    let compactColumnsConfig = [
        { id: 'online', group: '账号信息', label: '在线', checkboxIndex: 1, render: (user) => `<td data-col="online" style="text-align: center;">${dataMode === 'nodata' ? '-' : `<span class="status-dot-icon ${user.offlineDays === 0 ? 'online' : 'offline'}" title="${user.offlineDays === 0 ? '在线' : '离线'}"></span>`}</td>` },
        { id: 'uid', group: '账号信息', label: '用户ID', checkboxIndex: 3, render: (user) => `<td class="cell-val" data-col="uid">${dataMode === 'nodata' ? '-' : renderDataState(user.uid, 'copyable')}</td>` },
        { id: 'account', group: '账号信息', label: '会员名', checkboxIndex: 3, render: (user) => `<td data-col="account"><a href="#" class="cell-username user-detail-link" data-uid="${user.uid}">${dataMode === 'nodata' ? '<span class="data-na">N/A</span>' : renderDataState(user.account, 'copyable')}</a></td>` },
        { id: 'agentId', group: '账号信息', label: '代理', checkboxIndex: 3, render: (user) => `<td class="cell-val" data-col="agentId">${renderDataState(user.agentId)}</td>` },
        { id: 'status', group: '账号信息', label: '状态', checkboxIndex: 1, render: (user) => `<td data-col="status"><span class="user-custom-tag ${user.status === '正常' ? 'tag-green' : user.status === '冻结' ? 'tag-blue' : 'tag-red'}">${user.status}</span></td>` },
        { id: 'vipLevel', group: '等级', label: 'VIP等级', checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="vipLevel">${user.vipLevel || 'VIP ' + (user.vipLevel || 1)}</td>` },
        { id: 'payLevel', group: '等级', label: '支付层级', checkboxIndex: 4, render: (user) => `<td class="cell-val" data-col="payLevel">${user.payLevel}</td>` },
        { id: 'currency', group: '额度', label: '主钱包币种', checkboxIndex: 5, render: (user) => `<td class="cell-val" data-col="currency">${user.currency || 'RMB'}</td>` },
        { id: 'availableCredit', group: '额度', label: '可用额度', sortable: true, checkboxIndex: 5, render: (user) => `<td class="cell-money" data-col="availableCredit">${formatAmount(user.availableCredit, user.currency)}</td>` },
        { id: 'thirdBal', group: '额度', label: '三方余额', sortable: true, checkboxIndex: 5, render: (user) => `<td data-col="thirdBal"><div style="display:flex;align-items:center;justify-content:flex-start;">${formatAmount(user.thirdBal, user.currency)} <i class="ph ph-arrows-clockwise refresh-icon-compact" data-uid="${user.uid}" style="margin-left:4px;cursor:pointer;color:#2563eb;" title="刷新余额"></i></div></td>` },
        { id: 'ds_depTotal_main', category: '存取款资料', group: '主钱包', label: '存款总额', tag: '主钱包', tagColor: 'blue', sortable: true, checkboxIndex: 6, render: (user) => `<td class="cell-money ${user.deposit > 0 ? 'highlight' : ''}" data-col="ds_depTotal_main">${formatAmount(user.deposit, user.currency)}</td>` },
        { id: 'ds_wdrTotal_main', category: '存取款资料', group: '主钱包', label: '取款总额', tag: '主钱包', tagColor: 'blue', sortable: true, checkboxIndex: 6, render: (user) => `<td class="cell-money" data-col="ds_wdrTotal_main">${formatAmount(user.withdraw, user.currency)}</td>` },
        { id: 'ds_depTotal_summary', category: '存取款资料', group: '汇总 USDT', label: '存款总额', tag: '汇总', tagColor: 'purple', sortable: true, checkboxIndex: 6, render: (user) => `<td class="cell-money ${user.deposit > 0 ? 'highlight' : ''}" data-col="ds_depTotal_summary">${formatAmount(user.deposit, 'USDT')}</td>` },
        { id: 'ds_wdrTotal_summary', category: '存取款资料', group: '汇总 USDT', label: '取款总额', tag: '汇总', tagColor: 'purple', sortable: true, checkboxIndex: 6, render: (user) => `<td class="cell-money" data-col="ds_wdrTotal_summary">${formatAmount(user.withdraw, 'USDT')}</td>` },
        { id: 'ip', group: '日期信息', label: '登入IP', checkboxIndex: 9, render: (user) => `<td class="cell-val" data-col="ip"><div class="ip-row" style="display: flex; align-items: center; gap: 4px;">${renderDataState(user.ip, 'ip')}</div></td>` },
        { id: 'date', group: '日期信息', label: '新增时间', sortable: true, checkboxIndex: 9, render: (user) => `<td class="cell-val" data-col="date">${user.date}</td>` },
        { id: 'lastLogin', group: '日期信息', label: '登入时间', sortable: true, checkboxIndex: 9, render: (user) => `<td class="cell-val" data-col="lastLogin">${user.lastLogin}</td>` },
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
                other: window.dataMode === 'nodata' ? '-' : (index % 2 === 0 ? "未充值玩家" : "测试账号"),
                vip: window.dataMode === 'nodata' ? '-' : (index % 3 === 0 ? "钻石会员" : index % 3 === 1 ? "黄金会员" : "白银会员"),
                level: window.dataMode === 'nodata' ? '-' : (index % 3 === 0 ? "VIP会员" : index % 3 === 1 ? "黄金会员" : "普通会员")
            });
        });
    }
    window.mockUsers = mockUsers;

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
        if (selectedCurrencyVal) {
            tags.push({ key: 'currency', label: `主钱包币种: ${selectedCurrencyVal}`, type: 'single-custom', element: dropdownCurrency, defaultValue: '', defaultText: '全部币种', valueVarSetter: (v) => selectedCurrencyVal = v });
        }
        // 4. Other
        const selectedOthers = getMultiSelectValues(dropdownOther);
        if (selectedOthers.length > 0) {
            tags.push({ key: 'other', label: `其他: ${selectedOthers.join(', ')}`, type: 'multi-custom', element: dropdownOther });
        }
        // 5. Account
        if (inputAccount && inputAccount.value.trim()) {
            let labelPrefix = '账号';
            if (currentAccountType === 'exact') labelPrefix = '账号(精确)';
            if (currentAccountType === 'fuzzy') labelPrefix = '账号(模糊)';
            if (currentAccountType === 'multi') labelPrefix = '账号(多笔)';

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

        setSingleSelectValue(dropdownCurrency, '', '全部币种');
        selectedCurrencyVal = '';
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
                if (selectedCurrencyVal && user.currency !== selectedCurrencyVal) return false;

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
                let sortKey = currentSortColumn;
                const dsMapping = {
                    'ds_debt': 'arrears',
                    'ds_creditVal': 'creditValue',
                    'ds_balTreas': 'balanceBuy',
                    'ds_balInt': 'interest',
                    'ds_depTotal': 'deposit',
                    'ds_depCount': 'depositCount',
                    'ds_wdrTotal': 'withdraw',
                    'ds_wdrCount': 'withdrawCount',
                    'ds_wdrFee': 'withdrawPre',
                    'ds_sysAdd': 'adminAdd',
                    'ds_sysSub': 'adminDeduct',
                    'ds_commBal': 'commissionBal',
                    'ds_depTotal_main': 'deposit',
                    'ds_wdrTotal_main': 'withdraw',
                    'ds_wdrFee_main': 'withdrawPre',
                    'ds_sysAdd_main': 'adminAdd',
                    'ds_sysSub_main': 'adminDeduct',
                    'ds_depTotal_summary': 'deposit',
                    'ds_depCount_summary': 'depositCount',
                    'ds_wdrTotal_summary': 'withdraw',
                    'ds_wdrCount_summary': 'withdrawCount',
                    'ds_wdrFee_summary': 'withdrawPre',
                    'ds_sysAdd_summary': 'adminAdd',
                    'ds_sysSub_summary': 'adminDeduct',
                };
                if (dsMapping[sortKey]) {
                    sortKey = dsMapping[sortKey];
                }

                let valA = a[sortKey];
                let valB = b[sortKey];

                // Handle numeric conversion for arrears (e.g. "-" or numbers)
                if (sortKey === 'arrears') {
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
                    const justifyAttr = 'space-between';
                    const isSummary = col.group === '汇总 USDT';
                    const bgStyle = isSummary ? 'background-color: #f1f5f9 !important;' : '';
                    headerHtml += `<th class="header-sub sticky-col" style="left:${currentLeft}px; min-width:110px; z-index:12; ${bgStyle}" data-col="${col.id}">
                        <div style="display:flex;align-items:center;white-space:nowrap;justify-content:${justifyAttr};">
                            <div style="display:flex;align-items:center;">
                                <span>${col.label}</span>
                            </div>
                            ${col.sortable
                            ? `<div class="header-inline-actions">
                                    ${getSortBtn(col.id)}
                                    <i class="ph ph-push-pin icon-pin active" data-id="${col.id}" title="取消钉选"></i>
                               </div>`
                            : `<div class="header-inline-actions"><i class="ph ph-push-pin icon-pin active" data-id="${col.id}" title="取消钉选"></i></div>`
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
                    const justifyAttr = 'space-between';
                    const isSummary = col.group === '汇总 USDT';
                    const bgStyle = isSummary ? 'background-color: #f1f5f9 !important;' : '';
                    headerHtml += `<th class="header-sub" style="${bgStyle}" data-col="${col.id}">
                        <div style="display:flex;align-items:center;white-space:nowrap;justify-content:${justifyAttr};">
                            <div style="display:flex;align-items:center;">
                                <span>${col.label}</span>
                            </div>
                            ${col.sortable
                            ? `<div class="header-inline-actions">
                                    ${getSortBtn(col.id)}
                                    <i class="ph ph-push-pin icon-pin" data-id="${col.id}" title="钉选栏位"></i>
                               </div>`
                            : `<div class="header-inline-actions"><i class="ph ph-push-pin icon-pin" data-id="${col.id}" title="钉选栏位"></i></div>`
                        }
                        </div>
                        <div class="resizer"></div>
                    </th>`;
                });

                if (actionHeaderHtml) {
                    headerHtml += actionHeaderHtml;
                }
                
                let groupHeaderHtml = `<th class="header-group sticky-col" style="left:0; width: 40px; z-index: 40; border-bottom: 1px solid #f1f5f9; background: #f8fafc;"></th>
                <th class="header-group sticky-col sticky-col-1" width="40" style="left:40px; z-index: 40; border-bottom: 1px solid #f1f5f9; background: #f8fafc;"></th>`;

                let currentLeftGroup = 80;
                
                const buildGroups = (cols, isPinned) => {
                    let html = '';
                    let currentGroup = null;
                    let count = 0;
                    const renderGroupLabel = (groupName) => {
                        if (groupName === '主钱包') {
                            return `
                            <div style="color: #4338ca; font-weight: 600; font-size: 13px; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 4px; white-space: nowrap;">
                                <span>主钱包</span>
                            </div>`;
                        } else if (groupName === '汇总 USDT') {
                            return `
                            <div style="color: #4338ca; font-weight: 600; font-size: 13px; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 4px; white-space: nowrap;">
                                <span>汇总</span>
                                <span style="font-size: 12px;">(USDT)</span>
                            </div>`;
                        }
                        return groupName || '';
                    };

                    cols.forEach((col) => {
                        if (col.group !== currentGroup) {
                            if (currentGroup !== null) {
                                html += `<th class="header-group ${isPinned ? 'sticky-col' : ''}" colspan="${count}" style="${isPinned ? `left:${currentLeftGroup}px; z-index: 40;` : 'z-index: 20;'} text-align: center; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; background: ${currentGroup === '汇总 USDT' ? '#f1f5f9 !important' : '#f8fafc'}; padding: 6px; font-weight: 600; color: #475569; overflow: visible;">${renderGroupLabel(currentGroup)}</th>`;
                                if (isPinned) currentLeftGroup += 110 * count;
                            }
                            currentGroup = col.group;
                            count = 1;
                        } else {
                            count++;
                        }
                    });
                    if (currentGroup !== null) {
                        html += `<th class="header-group ${isPinned ? 'sticky-col' : ''}" colspan="${count}" style="${isPinned ? `left:${currentLeftGroup}px; z-index: 40;` : 'z-index: 20;'} text-align: center; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; background: ${currentGroup === '汇总 USDT' ? '#f1f5f9 !important' : '#f8fafc'}; padding: 6px; font-weight: 600; color: #475569; overflow: visible;">${renderGroupLabel(currentGroup)}</th>`;
                        if (isPinned) currentLeftGroup += 110 * count;
                    }
                    return html;
                };

                groupHeaderHtml += buildGroups(pinned, true);
                groupHeaderHtml += buildGroups(unpinnedWithoutAction, false);
                if (actionCol) groupHeaderHtml += `<th class="header-group sticky-col-right" style="min-width: 60px; z-index: 30; border-bottom: 1px solid #f1f5f9; background: #f8fafc;"></th>`;

                userTableHeader.innerHTML = `
                    <tr class="header-group-row">${groupHeaderHtml}</tr>
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

                        if (col.id === 'avatar') {
                            const isOnline = user.offlineDays === 0;
                            const statusDotHtml = window.dataMode === 'nodata' ? '' : `<span class="status-dot-icon ${isOnline ? 'online' : 'offline'}" title="${isOnline ? '在线' : '离线'}"></span>`;
                            nestedRowHtml += `<td class="${stickyClass}" style="text-align: center;">
                            <div class="user-avatar-circle-grey">
                                <i class="ph-fill ph-user"></i>
                                ${statusDotHtml}
                            </div>
                        </td>`;
                        } else if (col.id === 'memberInfo') {
                            nestedRowHtml += `<td class="nested-cell-info ${stickyClass}">
                            <div><span class="info-label">用户ID :</span> ${dataMode === 'nodata' ? '-' : renderDataState(user.uid, 'copyable')}</div>
                            <div><span class="info-label">会员名 :</span> <a href="#" class="user-detail-link" data-uid="${user.uid}">${dataMode === 'nodata' ? '<span class="data-na">N/A</span>' : renderDataState(user.account, 'copyable')}</a></div>
                            <div><span class="info-label">真实姓名 :</span> ${renderDataState(user.realName, 'na')}</div>
                            <div><span class="info-label">用户暱称 :</span> ${renderDataState(user.nickname, 'na')}</div>
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
                            <div><span class="info-label">账号类型 :</span> ${user.accountType || '普通账号'}</div>
                            <div><span class="info-label">会员类型 :</span> ${user.userType || '代理会员'}</div>
                            <div><span class="info-label">邀请码 :</span> ${user.inviteCode || '-'}</div>
                            <div><span class="info-label">直属下级/团队人数 :</span> <a href="#" class="subordinate-link" style="color: var(--primary-color); text-decoration: underline;" data-uid="${user.uid}">${user.directTeam || '0/0'}</a></div>
                            <div><span class="info-label">VIP会员等级 :</span> ${user.vipLevel || 0}</div>
                            <div><span class="info-label">VIP成长值 :</span> ${user.vipGrowth || 0}</div>
                        </td>`;
                        } else if (col.id === 'creditLimit') {
                            nestedRowHtml += `<td class="nested-cell-info ${stickyClass}">
                            <div><span class="info-label">信用值 :</span> <a class="wallet-detail-link" data-title="信用值" data-wallet="${user.currency || 'RMB'}" data-amount="${user.creditValue}">${formatAmount(user.creditValue, 'RMB')}</a></div>
                            <div><span class="info-label">可用额度 :</span> <a class="wallet-detail-link" data-title="可用额度" data-wallet="${user.currency || 'RMB'}" data-amount="${user.availableCredit}">${formatAmount(user.availableCredit, user.currency)}</a> ${user.currency || 'RMB'}</div>
                            <div><span class="info-label">佣金余额 :</span> <a class="wallet-detail-link" data-title="佣金余额" data-wallet="${user.currency || 'RMB'}" data-amount="${user.commissionBal}">${formatAmount(user.commissionBal, user.currency)}</a> ${user.currency || 'RMB'}</div>
                            <div><span class="info-label">余额宝 :</span> <a class="wallet-detail-link" data-title="余额宝" data-wallet="${user.currency || 'RMB'}" data-amount="${user.balanceBuy || 0}">${formatAmount(user.balanceBuy || 0, user.currency)}</a> ${user.currency || 'RMB'}</div>
                            <div><span class="info-label">欠款 :</span> <a class="wallet-detail-link" data-title="欠款" data-wallet="${user.currency || 'RMB'}" data-amount="${user.arrears || 0}">${formatAmount(user.arrears || 0, user.currency)}</a> ${user.currency || 'RMB'}</div>
                            <div><span class="info-label">余额宝利息 :</span> <a class="wallet-detail-link" data-title="余额宝利息" data-wallet="${user.currency || 'RMB'}" data-amount="${user.interest || 0}">${formatAmount(user.interest || 0, user.currency)}</a> ${user.currency || 'RMB'}</div>
                            <div><span class="info-label">三方余额 :</span> <a class="wallet-detail-link" data-title="三方余额" data-wallet="${user.currency || 'RMB'}" data-amount="${user.thirdBal || 0}">${formatAmount(user.thirdBal || 0, user.currency)}</a> ${user.currency || 'RMB'} <a href="#" class="refresh-link" style="color:#2563eb;font-size:12px;margin-left:4px;text-decoration:none;">刷新</a></div>
                            <div><span class="info-label">会员积分 :</span> <a class="wallet-detail-link" data-title="会员积分" data-wallet="积分" data-amount="${user.points || 0}">${user.points || 0}</a></div>
                        </td>`;
                        } else if (col.id === 'depositWithdraw') {
                            nestedRowHtml += `<td class="nested-cell-info ${stickyClass}">
                            <div><span class="info-label">存款总额 :</span> <a class="wallet-detail-link" data-title="存款总额" data-wallet="${user.currency || 'RMB'}" data-amount="${user.deposit}">${formatAmount(user.deposit, user.currency)}</a> ${user.currency || 'RMB'}</div>
                            <div><span class="info-label">取款总额 :</span> <a class="wallet-detail-link" data-title="取款总额" data-wallet="${user.currency || 'RMB'}" data-amount="${user.withdraw}">${formatAmount(user.withdraw, user.currency)}</a> ${user.currency || 'RMB'}</div>
                            <div><span class="info-label">提款预扣金额 :</span> <a class="wallet-detail-link" data-title="提款预扣金额" data-wallet="${user.currency || 'RMB'}" data-amount="${user.withdrawPre}">${formatAmount(user.withdrawPre, user.currency)}</a> ${user.currency || 'RMB'}</div>
                            <div><span class="info-label">后台加款总额 :</span> <a class="wallet-detail-link" data-title="后台加款总额" data-wallet="${user.currency || 'RMB'}" data-amount="${user.adminAdd || 0}">${formatAmount(user.adminAdd || 0, user.currency)}</a> ${user.currency || 'RMB'}</div>
                            <div><span class="info-label">后台扣款总额 :</span> <a class="wallet-detail-link" data-title="后台扣款总额" data-wallet="${user.currency || 'RMB'}" data-amount="${user.adminDeduct}">${formatAmount(user.adminDeduct, user.currency)}</a> ${user.currency || 'RMB'}</div>
                            <div><span class="info-label">存款次数 :</span> <a class="wallet-detail-link" data-title="存款次数" data-wallet="${user.currency || 'RMB'}" data-amount="${user.depositCount || 0}">${user.depositCount || 0}</a></div>
                            <div><span class="info-label">取款次数 :</span> <a class="wallet-detail-link" data-title="取款次数" data-wallet="${user.currency || 'RMB'}" data-amount="${user.withdrawCount || 0}">${user.withdrawCount || 0}</a></div>
                        </td>`;
                        } else if (col.id === 'dwSummary') {
                            let depUSDT = user.depositUSDT || (user.deposit && user.deposit !== '-' ? (user.deposit / 7.2) : 0);
                            let witUSDT = user.withdrawUSDT || (user.withdraw && user.withdraw !== '-' ? (user.withdraw / 7.2) : 0);
                            let preUSDT = user.withdrawPreUSDT || (user.withdrawPre && user.withdrawPre !== '-' ? (user.withdrawPre / 7.2) : 0);
                            nestedRowHtml += `<td class="nested-cell-info ${stickyClass}">
                            <div><span class="info-label">存款总额 :</span> <a class="wallet-detail-link" data-title="存款总额 (USDT)" data-wallet="USDT" data-amount="${depUSDT}">${formatAmount(depUSDT, 'USDT')}</a> USDT</div>
                            <div><span class="info-label">取款总额 :</span> <a class="wallet-detail-link" data-title="取款总额 (USDT)" data-wallet="USDT" data-amount="${witUSDT}">${formatAmount(witUSDT, 'USDT')}</a> USDT</div>
                            <div><span class="info-label">提款预扣金额 :</span> <a class="wallet-detail-link" data-title="提款预扣金额 (USDT)" data-wallet="USDT" data-amount="${preUSDT}">${formatAmount(preUSDT, 'USDT')}</a> USDT</div>
                            <div><span class="info-label">后台加款总额 :</span> <a class="wallet-detail-link" data-title="后台加款总额 (USDT)" data-wallet="USDT" data-amount="0">${formatAmount(0, 'USDT')}</a> USDT</div>
                            <div><span class="info-label">后台扣款总额 :</span> <a class="wallet-detail-link" data-title="后台扣款总额 (USDT)" data-wallet="USDT" data-amount="0">${formatAmount(0, 'USDT')}</a> USDT</div>
                            <div><span class="info-label">存款次数 :</span> <a class="wallet-detail-link" data-title="存款次数 (USDT)" data-wallet="USDT" data-amount="${user.depositCountUSDT || user.depositCount || 0}">${user.depositCountUSDT || user.depositCount || 0}</a></div>
                            <div><span class="info-label">取款次数 :</span> <a class="wallet-detail-link" data-title="取款次数 (USDT)" data-wallet="USDT" data-amount="${user.withdrawCountUSDT || user.withdrawCount || 0}">${user.withdrawCountUSDT || user.withdrawCount || 0}</a></div>
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

                            nestedRowHtml += `<td class="${stickyClass}" style="width: 140px; max-width: 140px;">
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
                            nestedRowHtml += `<td class="nested-cell-info wrap-text ${stickyClass}">
                            <div><span class="info-label">备注 :</span> ${dataMode === 'nodata' ? '<span class="data-na">N/A</span>' : renderDataState(user.remark, 'longText')}</div>
                            <div><span class="info-label">回访备注 :</span> ${dataMode === 'nodata' ? '<span class="data-na">N/A</span>' : renderDataState(user.followRemark, 'longText')}</div>
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
                        let bgStyle = col.group === '汇总 USDT' ? 'background-color: #f1f5f9 !important; ' : '';
                        const match = cellStr.match(/^<td([^>]*?)class="([^"]*)"/);
                        if (match) {
                            cellStr = cellStr.replace(/^<td([^>]*?)class="/, `<td$1style="left:${currentLeft}px; min-width:110px; ${bgStyle}" class="sticky-col `);
                        } else {
                            cellStr = cellStr.replace(/^<td/, `<td style="left:${currentLeft}px; min-width:110px; ${bgStyle}" class="sticky-col"`);
                        }
                        cellsHtml += cellStr;
                        currentLeft += 110;
                    });

                    const unpinnedWithoutAction = unpinned.filter(col => col.id !== 'action');
                    unpinnedWithoutAction.forEach(col => {
                        let cellStr = col.render(user);
                        if (col.group === '汇总 USDT') {
                            if (cellStr.includes('style="')) {
                                cellStr = cellStr.replace('style="', 'style="background-color: #f1f5f9 !important; ');
                            } else {
                                cellStr = cellStr.replace(/^<td/, '<td style="background-color: #f1f5f9 !important;"');
                            }
                        }
                        cellsHtml += cellStr;
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

                    const renderDropdownUI = (mainCurrency) => {
                        const allCurrencies = ['USDT', 'RMB', 'VND', 'PHP', 'MYR'];
                        const otherCurrencies = allCurrencies.filter(c => c !== mainCurrency);
                        return `
                        <div class="custom-unit-dropdown" style="margin-left: auto; position: relative;">
                            <button type="button" style="background: #eef2ff; color: #4f46e5; border-radius: 6px; padding: 4px 8px; border: none; display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer; font-weight: 500;">
                                单位: <span>${mainCurrency}</span> <i class="ph ph-caret-down"></i>
                            </button>
                            <div class="dropdown-menu" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 4px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); z-index: 10; width: 120px; padding: 4px 0; text-align: left;">
                                <div style="padding: 4px 12px; font-size: 12px; color: #94a3b8; font-weight: 500;">主钱包</div>
                                <div class="dropdown-item" data-value="${mainCurrency}" style="padding: 6px 12px; font-size: 13px; color: #4f46e5; background: #f8fafc; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                                    ${mainCurrency} <i class="ph ph-check" style="color: #10b981; display: inline-block;"></i>
                                </div>
                                <div style="height: 1px; background: #e2e8f0; margin: 4px 0;"></div>
                                <div style="padding: 4px 12px; font-size: 12px; color: #94a3b8; font-weight: 500;">其他币种</div>
                                ${otherCurrencies.map(u => `
                                <div class="dropdown-item" data-value="${u}" style="padding: 6px 12px; font-size: 13px; color: #334155; background: transparent; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                                    ${u} <i class="ph ph-check" style="color: #10b981; display: none;"></i>
                                </div>
                                `).join('')}
                            </div>
                        </div>
                        `;
                    };
                    const colCount = compactColumnsConfig.length + 2; // +1 for checkbox, +1 for expand
                    expandTr.innerHTML = `
                    <td colspan="${colCount}" style="padding: 16px; background: #f8fafc; border-bottom: 1px solid var(--border-color);">
                        <div class="detail-cards-wrapper" style="display:flex; gap:16px; flex-wrap:nowrap; overflow-x:auto; padding: 0 40px; padding-bottom: 8px;">
                            <!-- 大头照 -->
                            <div style="flex: 0 0 60px; display:flex; justify-content:center; align-items:flex-start; margin-top: 8px;">
                                <div style="width:60px; height:60px; background:#6366f1; color:white; border-radius:8px; display:flex; justify-content:center; align-items:center; font-size:24px; font-weight:bold;">${user.account.charAt(0).toUpperCase()}</div>
                            </div>
                            <!-- 基本资料 -->
                            <div class="detail-card" data-category="基本资料" style="flex: 0 0 auto; width: 510px; display: ${(dataSourceFieldVisibility['ds_realname'] !== false || dataSourceFieldVisibility['ds_birthday'] !== false || dataSourceFieldVisibility['ds_accountType'] !== false || dataSourceFieldVisibility['ds_memberType'] !== false || dataSourceFieldVisibility['ds_level'] !== false || dataSourceFieldVisibility['ds_regMode'] !== false || dataSourceFieldVisibility['ds_nickname'] !== false || dataSourceFieldVisibility['ds_phone'] !== false) ? 'block' : 'none'};">
                                <div class="detail-card-header"><i class="ph ph-user"></i> 基本资料</div>
                                <div class="detail-card-body grid-2-col">
                                    <div class="ds-field" data-ds-id="ds_realname" style="display:${dataSourceFieldVisibility['ds_realname'] !== false ? '' : 'none'}"><span class="lbl">真实姓名</span> <span class="val" title="${dataMode === 'nodata' ? '' : user.realName}">${dataMode === 'nodata' ? '<span class="data-na">N/A</span>' : (user.realName && user.realName.length > 15 ? user.realName.substring(0, 15) + '...' : user.realName)}</span></div>
                                    <div class="ds-field" data-ds-id="ds_birthday" style="display:${dataSourceFieldVisibility['ds_birthday'] !== false ? '' : 'none'}"><span class="lbl">生日</span> <span class="val">${dataMode === 'nodata' ? '-' : '1991-02-11'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_accountType" style="display:${dataSourceFieldVisibility['ds_accountType'] !== false ? '' : 'none'}"><span class="lbl">账号类型</span> <span class="val">${user.accountType || '普通账号'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_memberType" style="display:${dataSourceFieldVisibility['ds_memberType'] !== false ? '' : 'none'}"><span class="lbl">会员类型</span> <span class="val">${user.userType || '代理会员'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_level" style="display:${dataSourceFieldVisibility['ds_level'] !== false ? '' : 'none'}"><span class="lbl">等级</span> <span class="val">${dataMode === 'nodata' ? '-' : (user.vipLevel ? 'VIP ' + user.vipLevel : 'VIP 1')}</span></div>
                                    <div class="ds-field" data-ds-id="ds_regMode" style="display:${dataSourceFieldVisibility['ds_regMode'] !== false ? '' : 'none'}"><span class="lbl">注册模式</span> <span class="val">${user.registerMode || '一般注册'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_nickname" style="display:${dataSourceFieldVisibility['ds_nickname'] !== false ? '' : 'none'}"><span class="lbl">昵称</span> <span class="val" style="line-height: 1.8; padding: 2px 0;">${dataMode === 'nodata' ? '<span class="data-na">N/A</span>' : (user.nickname || '-')}</span></div>
                                    <div class="ds-field" data-ds-id="ds_phone" style="display:${dataSourceFieldVisibility['ds_phone'] !== false ? '' : 'none'}"><span class="lbl">手机号</span> <span class="val">${dataMode === 'nodata' ? '-' : renderDataState(user.phone, 'phone')}</span></div>
                                </div>
                            </div>
                            <!-- 存取款数据 (主钱包 / 汇总) Combined Card -->
                            <div class="detail-card" data-category="存取款资料" style="flex: 1 1 100%; display: ${(dataSourceFieldVisibility['ds_depTotal_main'] !== false || dataSourceFieldVisibility['ds_depTotal_summary'] !== false || dataSourceFieldVisibility['ds_depCount_main'] !== false || dataSourceFieldVisibility['ds_depCount_summary'] !== false || dataSourceFieldVisibility['ds_wdrTotal_main'] !== false || dataSourceFieldVisibility['ds_wdrTotal_summary'] !== false || dataSourceFieldVisibility['ds_wdrCount_main'] !== false || dataSourceFieldVisibility['ds_wdrCount_summary'] !== false || dataSourceFieldVisibility['ds_wdrFee_main'] !== false || dataSourceFieldVisibility['ds_wdrFee_summary'] !== false || dataSourceFieldVisibility['ds_sysAdd_main'] !== false || dataSourceFieldVisibility['ds_sysAdd_summary'] !== false || dataSourceFieldVisibility['ds_sysSub_main'] !== false || dataSourceFieldVisibility['ds_sysSub_summary'] !== false) ? 'flex' : 'none'}; min-width: max-content; width: auto; flex-direction: column;">
                                <div class="detail-card-header" style="display: none;"></div>
                                <div class="detail-card-body" data-no-sort="true" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px 0; padding: 16px;">
                                    <!-- Column 1 -->
                                    <div style="display: flex; flex-direction: column; gap: 12px; padding-right: 24px;">
                                        <!-- Micro Header -->
                                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; align-items: center; min-height: 29px;">
                                            <span style="font-size: 15px; font-weight: 600; color: #1e293b; white-space: nowrap; width: 100px;">存取款资料</span>
                                            <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; justify-items: end;">
                                                <div class="custom-unit-dropdown" data-main-currency="${user.currency || 'RMB'}" style="display: inline-block; position: relative; min-width: 90px; width: auto; text-align: right; white-space: nowrap;">
                                                    <button type="button" style="background: none; border: none; padding: 0; color: #4338ca; font-weight: 600; font-size: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: flex-end; width: 100%; white-space: nowrap;">
                                                        <span class="dropdown-title">主钱包</span>
                                                        <span style="display: flex; align-items: center; gap: 4px; font-size: 11px; margin-top: 2px;">(<span class="selected-val main-currency-label">${user.currency || 'RMB'}</span>) <i class="ph ph-caret-down"></i></span>
                                                    </button>
                                                    <div class="dropdown-menu" style="display: none; position: absolute; right: 0; top: 100%; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); z-index: 10; min-width: 80px; text-align: left;">
                                                        ${['USDT', 'RMB', 'VND', 'PHP', 'MYR'].map(c => `<div class="dropdown-item" data-value="${c}" style="padding: 8px 12px; font-size: 13px; color: #1e293b; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">${c}${c === (user.currency || 'RMB') ? ' <span style="font-size: 10px; background: #eff6ff; color: #3b82f6; padding: 2px 4px; border-radius: 4px; border: 1px solid #bfdbfe;">主钱包</span>' : ''}</div>`).join('')}
                                                    </div>
                                                </div>
                                                <span style="min-width: 90px; width: auto; text-align: right; white-space: nowrap; color: #6366f1; font-weight: 600; display: flex; flex-direction: column; align-items: flex-end;">
                                                    <span style="font-size: 12px;">汇总</span>
                                                    <span style="font-size: 11px; margin-top: 2px;">(USDT)</span>
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rows -->
                                        <div data-ds-row="ds_depTotal" style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                                            <span style="width: 100px; color: #64748b; font-weight: 500;">存款总额</span>
                                            <div class="ds-val-grid" style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; justify-items: end;">
                                                <div class="ds-field" data-ds-id="ds_depTotal_main" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val" style="font-family: monospace; font-weight: 600; color: #334155;">${formatAmount(user.deposit, user.currency)}</span></div>
                                                <div class="ds-field" data-ds-id="ds_depTotal_summary" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val" style="font-family: monospace; font-weight: 600; color: #4338ca; background: #f8fafc; padding: 2px 6px; border-radius: 4px;">${formatAmount(user.deposit, 'USDT')}</span></div>
                                            </div>
                                        </div>
                                        
                                        <div data-ds-row="ds_depCount" style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                                            <span style="width: 100px; color: #64748b; font-weight: 500;">存款次数</span>
                                            <div class="ds-val-grid" style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; justify-items: end;">
                                                <div class="ds-field" data-ds-id="ds_depCount_main" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val" style="font-family: monospace; font-weight: 600; color: #334155;">${user.depositCount || '0'}</span></div>
                                                <div class="ds-field" data-ds-id="ds_depCount_summary" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val" style="font-family: monospace; font-weight: 600; color: #4338ca; background: #f8fafc; padding: 2px 6px; border-radius: 4px;">${user.depositCount || '0'}</span></div>
                                            </div>
                                        </div>
                                        
                                        <div data-ds-row="ds_wdrTotal" style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                                            <span style="width: 100px; color: #64748b; font-weight: 500;">取款总额</span>
                                            <div class="ds-val-grid" style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; justify-items: end;">
                                                <div class="ds-field" data-ds-id="ds_wdrTotal_main" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val" style="font-family: monospace; font-weight: 600; color: #334155;">${formatAmount(user.withdraw, user.currency)}</span></div>
                                                <div class="ds-field" data-ds-id="ds_wdrTotal_summary" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val" style="font-family: monospace; font-weight: 600; color: #4338ca; background: #f8fafc; padding: 2px 6px; border-radius: 4px;">${formatAmount(user.withdraw, 'USDT')}</span></div>
                                            </div>
                                        </div>
                                        
                                        <div data-ds-row="ds_wdrCount" style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                                            <span style="width: 100px; color: #64748b; font-weight: 500;">取款次数</span>
                                            <div class="ds-val-grid" style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; justify-items: end;">
                                                <div class="ds-field" data-ds-id="ds_wdrCount_main" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val" style="font-family: monospace; font-weight: 600; color: #334155;">${user.withdrawCount || '0'}</span></div>
                                                <div class="ds-field" data-ds-id="ds_wdrCount_summary" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val" style="font-family: monospace; font-weight: 600; color: #4338ca; background: #f8fafc; padding: 2px 6px; border-radius: 4px;">${user.withdrawCount || '0'}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Column 2 -->
                                    <div style="display: flex; flex-direction: column; gap: 12px; padding-left: 24px; border-left: 1px solid #f1f5f9;">
                                        <!-- Micro Header -->
                                        <div style="display: flex; justify-content: flex-end; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; align-items: center; min-height: 29px;">
                                            <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; justify-items: end; margin-left: 100px;">
                                                <div class="custom-unit-dropdown" data-main-currency="${user.currency || 'RMB'}" style="display: inline-block; position: relative; min-width: 90px; width: auto; text-align: right; white-space: nowrap;">
                                                    <button type="button" style="background: none; border: none; padding: 0; color: #4338ca; font-weight: 600; font-size: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: flex-end; width: 100%; white-space: nowrap;">
                                                        <span class="dropdown-title">主钱包</span>
                                                        <span style="display: flex; align-items: center; gap: 4px; font-size: 11px; margin-top: 2px;">(<span class="selected-val main-currency-label">${user.currency || 'RMB'}</span>) <i class="ph ph-caret-down"></i></span>
                                                    </button>
                                                    <div class="dropdown-menu" style="display: none; position: absolute; right: 0; top: 100%; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); z-index: 10; min-width: 80px; text-align: left;">
                                                        ${['USDT', 'RMB', 'VND', 'PHP', 'MYR'].map(c => `<div class="dropdown-item" data-value="${c}" style="padding: 8px 12px; font-size: 13px; color: #1e293b; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">${c}${c === (user.currency || 'RMB') ? ' <span style="font-size: 10px; background: #eff6ff; color: #3b82f6; padding: 2px 4px; border-radius: 4px; border: 1px solid #bfdbfe;">主钱包</span>' : ''}</div>`).join('')}
                                                    </div>
                                                </div>
                                                <span style="min-width: 90px; width: auto; text-align: right; white-space: nowrap; color: #6366f1; font-weight: 600; display: flex; flex-direction: column; align-items: flex-end;">
                                                    <span style="font-size: 12px;">汇总</span>
                                                    <span style="font-size: 11px; margin-top: 2px;">(USDT)</span>
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rows -->
                                        <div data-ds-row="ds_wdrFee" style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                                            <span style="width: 100px; color: #64748b; font-weight: 500;">提款预扣金额</span>
                                            <div class="ds-val-grid" style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; justify-items: end;">
                                                <div class="ds-field" data-ds-id="ds_wdrFee_main" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val" style="font-family: monospace; font-weight: 600; color: #334155;">${formatAmount(user.withdrawPre, user.currency)}</span></div>
                                                <div class="ds-field" data-ds-id="ds_wdrFee_summary" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val" style="font-family: monospace; font-weight: 600; color: #4338ca; background: #f8fafc; padding: 2px 6px; border-radius: 4px;">${formatAmount(user.withdrawPre, 'USDT')}</span></div>
                                            </div>
                                        </div>
                                        
                                        <div data-ds-row="ds_sysAdd" style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                                            <span style="width: 100px; color: #64748b; font-weight: 500;">后台加款总额</span>
                                            <div class="ds-val-grid" style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; justify-items: end;">
                                                <div class="ds-field" data-ds-id="ds_sysAdd_main" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val text-green" style="font-family: monospace; font-weight: 600;">${dataMode === 'nodata' ? '-' : formatAmount(1000000, user.currency)}</span></div>
                                                <div class="ds-field" data-ds-id="ds_sysAdd_summary" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val text-green" style="font-family: monospace; font-weight: 600; background: #f8fafc; padding: 2px 6px; border-radius: 4px;">${dataMode === 'nodata' ? '-' : formatAmount(1800, 'USDT')}</span></div>
                                            </div>
                                        </div>
                                        
                                        <div data-ds-row="ds_sysSub" style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                                            <span style="width: 100px; color: #64748b; font-weight: 500;">后台扣款总额</span>
                                            <div class="ds-val-grid" style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; justify-items: end;">
                                                <div class="ds-field" data-ds-id="ds_sysSub_main" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val" style="font-family: monospace; font-weight: 600; color: #a1a1aa;">${dataMode === 'nodata' ? '-' : '0'}</span></div>
                                                <div class="ds-field" data-ds-id="ds_sysSub_summary" style="min-width: 90px; width: auto; text-align: right; white-space: nowrap;"><span class="val text-red" style="font-family: monospace; font-weight: 600; background: #f8fafc; padding: 2px 6px; border-radius: 4px;">${dataMode === 'nodata' ? '-' : formatAmount(50, 'USDT')}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 成长与积分 -->
                            <div class="detail-card" data-category="成长与积分" style="flex: 0 0 auto; width: 240px; display: ${(dataSourceFieldVisibility['ds_growth'] !== false || dataSourceFieldVisibility['ds_vipGrowth'] !== false || dataSourceFieldVisibility['ds_points'] !== false) ? 'block' : 'none'};">
                                <div class="detail-card-header"><i class="ph ph-trend-up"></i> 成长与积分</div>
                                <div class="detail-card-body flex-list-col">
                                    <div class="ds-field" data-ds-id="ds_growth" style="display:${dataSourceFieldVisibility['ds_growth'] !== false ? '' : 'none'}"><span class="lbl">成长值</span> <span class="val">${user.growth || '0'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_vipGrowth" style="display:${dataSourceFieldVisibility['ds_vipGrowth'] !== false ? '' : 'none'}"><span class="lbl">VIP成长值</span> <span class="val">${user.vipGrowth || '0'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_points" style="display:${dataSourceFieldVisibility['ds_points'] !== false ? '' : 'none'}"><span class="lbl">会员积分</span> <span class="val">${user.points || '0'}</span></div>
                                </div>
                            </div>
                            <!-- 推荐关系 -->
                            <div class="detail-card" data-category="推荐关系" style="flex: 0 0 auto; width: 240px; display: ${(dataSourceFieldVisibility['ds_inviter'] !== false || dataSourceFieldVisibility['ds_inviteCode'] !== false || dataSourceFieldVisibility['ds_team'] !== false || dataSourceFieldVisibility['ds_commBal'] !== false) ? 'block' : 'none'};">
                                <div class="detail-card-header">
                                    <div style="display: flex; align-items: center; gap: 8px;"><i class="ph ph-share-network"></i> 推荐关系</div>
                                    ${renderDropdownUI(user.currency || 'RMB')}
                                </div>
                                <div class="detail-card-body flex-list-col">
                                    <div class="ds-field" data-ds-id="ds_inviter" style="display:${dataSourceFieldVisibility['ds_inviter'] !== false ? '' : 'none'}"><span class="lbl">邀请人</span> <span class="val" style="line-height: 1.8; padding: 2px 0;">${user.inviter || '-'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_inviteCode" style="display:${dataSourceFieldVisibility['ds_inviteCode'] !== false ? '' : 'none'}"><span class="lbl">邀请码</span> <span class="val">${user.inviteCode || '-'}</span></div>
                                    <div class="ds-field" data-ds-id="ds_team" style="display:${dataSourceFieldVisibility['ds_team'] !== false ? '' : 'none'}"><span class="lbl">下级/团队</span> <a href="#" class="val subordinate-link text-blue" style="text-decoration: underline;" data-uid="${user.uid}">${user.directTeam || '0/0'}</a></div>
                                    <div class="ds-field" data-ds-id="ds_commBal" style="display:${dataSourceFieldVisibility['ds_commBal'] !== false ? '' : 'none'}"><span class="lbl">佣金余额</span> <span class="val text-red">${formatAmount(user.commissionBal, user.currency)}</span></div>
                                </div>
                            </div>
                            <!-- 余额宝 -->
                            <div class="detail-card" data-category="余额宝" style="flex: 0 0 auto; width: 240px; display: ${(dataSourceFieldVisibility['ds_balTreas'] !== false || dataSourceFieldVisibility['ds_balInt'] !== false) ? 'block' : 'none'};">
                                <div class="detail-card-header">
                                    <div style="display: flex; align-items: center; gap: 8px;"><i class="ph ph-wallet"></i> 余额宝</div>
                                    ${renderDropdownUI(user.currency || 'RMB')}
                                </div>
                                <div class="detail-card-body flex-list-col">
                                    <div class="ds-field" data-ds-id="ds_balTreas" style="display:${dataSourceFieldVisibility['ds_balTreas'] !== false ? '' : 'none'}"><span class="lbl">余额</span> <span class="val">${dataMode === 'nodata' ? '-' : formatAmount(15000, user.currency)}</span></div>
                                    <div class="ds-field" data-ds-id="ds_balInt" style="display:${dataSourceFieldVisibility['ds_balInt'] !== false ? '' : 'none'}"><span class="lbl">利息</span> <span class="val text-green">${dataMode === 'nodata' ? '-' : formatAmount(35, user.currency)}</span></div>
                                </div>
                            </div>
                            <!-- 用户标签 -->
                            <div class="detail-card ds-field" data-category="用户标签" data-ds-id="ds_tags" style="flex: 1 1 auto; min-width: 240px; width: fit-content; max-width: 100%; display:${dataSourceFieldVisibility['ds_tags'] !== false ? '' : 'none'}">
                                <div class="detail-card-header"><i class="ph ph-tag"></i> 用户标签</div>
                                <div class="detail-card-body" style="display:flex; flex-direction:row; flex-wrap:wrap; align-content:flex-start; gap:8px;">
                                    ${(user.tags && user.tags.length > 0) ? user.tags.map(t => `<span class="user-custom-tag tag-blue" style="max-width: 100%; overflow: hidden; text-overflow: ellipsis;" title="${t}">${t}</span>`).join('') : '<span style="color:#94a3b8; font-size:13px;">无标签</span>'}
                                </div>
                            </div>
                            <!-- 信贷 -->
                            <div class="detail-card" data-category="信贷" style="flex: 0 0 auto; width: 240px; display: ${(dataSourceFieldVisibility['ds_debt'] !== false || dataSourceFieldVisibility['ds_creditVal'] !== false) ? 'block' : 'none'};">
                                <div class="detail-card-header">
                                    <div style="display: flex; align-items: center; gap: 8px;"><i class="ph ph-credit-card"></i> 信贷</div>
                                    ${renderDropdownUI(user.currency || 'RMB')}
                                </div>
                                <div class="detail-card-body flex-list-col">
                                    <div class="ds-field" data-ds-id="ds_debt" style="display:${dataSourceFieldVisibility['ds_debt'] !== false ? '' : 'none'}"><span class="lbl">欠款</span> <span class="val text-red">${formatAmount(user.arrears, user.currency)}</span></div>
                                    <div class="ds-field" data-ds-id="ds_creditVal" style="display:${dataSourceFieldVisibility['ds_creditVal'] !== false ? '' : 'none'}"><span class="lbl">信用值</span> <span class="val">${formatAmount(user.creditValue, 'RMB')}</span></div>
                                </div>
                            </div>
                        </div>
                        <!-- 其他 (备注等底部信息) -->
                        <!-- 其他 (备注等底部信息) -->
                        <div class="detail-card" data-category="其他" style="display: ${(dataSourceFieldVisibility['ds_remark'] !== false || dataSourceFieldVisibility['ds_followup'] !== false) ? 'block' : 'none'}; border: none; box-shadow: none; background: transparent; padding: 0;">
                            <div style="width:100%; border-bottom: 1px dashed #e2e8f0; margin: 16px 0;"></div>
                            <div class="detail-card-body" style="width:100%; display:flex; gap:32px; margin-bottom: 8px; padding: 0 40px;">
                                <div class="ds-field" data-ds-id="ds_remark" style="display:${dataSourceFieldVisibility['ds_remark'] !== false ? 'flex' : 'none'}; gap:8px;"><span style="color:#64748b;">备注</span> ${dataMode === 'nodata' ? '<span class="data-na">N/A</span>' : `<span title="${user.remark || ''}">${user.remark ? (user.remark.length > 20 ? user.remark.substring(0, 20) + '...' : user.remark) : '-'}</span>`}</div>
                                <div class="ds-field" data-ds-id="ds_followup" style="display:${dataSourceFieldVisibility['ds_followup'] !== false ? 'flex' : 'none'}; gap:8px;"><span style="color:#64748b;">回访备注</span> ${dataMode === 'nodata' ? '<span class="data-na">N/A</span>' : `<span title="${user.followRemark || ''}">${user.followRemark ? (user.followRemark.length > 20 ? user.followRemark.substring(0, 20) + '...' : user.followRemark) : '-'}</span>`}</div>
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

                    if (currentTableMode === 'compact') {
                        if (customColumnDrawer) {
                            const tableHeader = document.querySelector('#userTable thead th');
                            if (tableHeader) {
                                const rect = tableHeader.getBoundingClientRect();
                                const availableSpace = window.innerHeight - rect.bottom - 10;
                                customColumnDrawer.style.setProperty('--max-drawer-height', `${availableSpace}px`);
                            }
                            customColumnDrawer.classList.add('show');
                            const customColumnOverlay = document.getElementById('customColumnOverlay');
                            if (customColumnOverlay) {
                                customColumnOverlay.style.display = 'block';
                                setTimeout(() => customColumnOverlay.style.opacity = '1', 10);
                            }
                            if (typeof renderDrawerStates === 'function') {
                                renderDrawerStates();
                                window.applyDrawerOrderToTable();
                            }
                        }
                    } else {
                        if (columnsDrawer) {
                            if (columnsDrawer.classList.contains('active')) {
                                columnsDrawer.classList.remove('active');
                            } else {
                                tempNestedColumnVisibility = { ...nestedColumnVisibility };
                                if (typeof tempNestedPinnedColumnIds !== 'undefined') {
                                    tempNestedPinnedColumnIds = [...nestedPinnedColumnIds];
                                }
                                renderDropdown();
                                columnsDrawer.classList.add('active');
                            }
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
            window.applyDrawerOrderToTable();
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
            html += `<ul class="column-list" style="display: grid; grid-template-columns: 1fr; gap: 8px;">`;
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
                html += `<ul class="column-list" style="display: grid; grid-template-columns: 1fr; gap: 8px;">`;
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

        const walletLink = e.target.closest('.wallet-detail-link');
        if (walletLink) {
            e.preventDefault();
            const title = walletLink.getAttribute('data-title');
            const wallet = walletLink.getAttribute('data-wallet');
            const amount = walletLink.getAttribute('data-amount');
            if (typeof openWalletDetailModal === 'function') {
                openWalletDetailModal(title, wallet, amount);
            }
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
        if (e.target.closest('.ip-link') || e.target.closest('.ip-link-icon')) {
            e.preventDefault();
            const el = e.target.closest('.ip-link') || e.target.closest('.ip-link-icon');
            const ip = el.dataset.ip;
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
                    nestedColumnVisibility = { ...tempNestedColumnVisibility };
                } else {
                    tempCompactColumnVisibility[colId] = e.target.checked;
                }
                renderDropdown(); // Update drawer UI only
                if (currentTableMode === 'nested') renderTable();
            } else if (e.target.classList.contains('group-cb-nested')) {
                const isChecked = e.target.checked;
                nestedColumnsConfig.forEach(col => {
                    tempNestedColumnVisibility[col.id] = isChecked;
                });
                nestedColumnVisibility = { ...tempNestedColumnVisibility };
                renderDropdown();
                if (currentTableMode === 'nested') renderTable();
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
                    nestedPinnedColumnIds = [...tempNestedPinnedColumnIds];
                } else {
                    const idx = tempPinnedColumnIds.indexOf(colId);
                    if (idx > -1) {
                        tempPinnedColumnIds.splice(idx, 1);
                    } else {
                        tempPinnedColumnIds.push(colId);
                    }
                }
                renderDropdown(); // Update drawer UI only
                if (currentTableMode === 'nested') renderTable();
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
        { id: 'ds_accountType', label: '账号类型', category: '基本资料' },
        { id: 'ds_memberType', label: '会员类型', category: '基本资料' },
        { id: 'ds_level', label: '等级', category: '基本资料' },
        { id: 'ds_regMode', label: '注册模式', category: '基本资料' },
        { id: 'ds_nickname', label: '暱称', category: '基本资料' },
        { id: 'ds_phone', label: '手机号', category: '基本资料' },
        { id: 'ds_depTotal_main', label: '存款总额', category: '存取款资料', group: '主钱包', tag: '主钱包', tagColor: 'blue', sortable: true },
        { id: 'ds_depCount_main', label: '存款次数', category: '存取款资料', group: '主钱包', tag: '主钱包', tagColor: 'blue' },
        { id: 'ds_wdrTotal_main', label: '取款总额', category: '存取款资料', group: '主钱包', tag: '主钱包', tagColor: 'blue', sortable: true },
        { id: 'ds_wdrCount_main', label: '取款次数', category: '存取款资料', group: '主钱包', tag: '主钱包', tagColor: 'blue' },
        { id: 'ds_wdrFee_main', label: '提款预扣金额', category: '存取款资料', group: '主钱包', tag: '主钱包', tagColor: 'blue', sortable: true },
        { id: 'ds_sysAdd_main', label: '后台加款总额', category: '存取款资料', group: '主钱包', tag: '主钱包', tagColor: 'blue', sortable: true },
        { id: 'ds_sysSub_main', label: '后台扣款总额', category: '存取款资料', group: '主钱包', tag: '主钱包', tagColor: 'blue', sortable: true },
        { id: 'ds_depTotal_summary', label: '存款总额', category: '存取款资料', group: '汇总 USDT', tag: '汇总', tagColor: 'purple', sortable: true },
        { id: 'ds_depCount_summary', label: '存款次数', category: '存取款资料', group: '汇总 USDT', tag: '汇总', tagColor: 'purple' },
        { id: 'ds_wdrTotal_summary', label: '取款总额', category: '存取款资料', group: '汇总 USDT', tag: '汇总', tagColor: 'purple', sortable: true },
        { id: 'ds_wdrCount_summary', label: '取款次数', category: '存取款资料', group: '汇总 USDT', tag: '汇总', tagColor: 'purple' },
        { id: 'ds_wdrFee_summary', label: '提款预扣金额', category: '存取款资料', group: '汇总 USDT', tag: '汇总', tagColor: 'purple', sortable: true },
        { id: 'ds_sysAdd_summary', label: '后台加款总额', category: '存取款资料', group: '汇总 USDT', tag: '汇总', tagColor: 'purple', sortable: true },
        { id: 'ds_sysSub_summary', label: '后台扣款总额', category: '存取款资料', group: '汇总 USDT', tag: '汇总', tagColor: 'purple', sortable: true },
        { id: 'ds_growth', label: '成长值', category: '成长与积分' },
        { id: 'ds_vipGrowth', label: 'VIP成长值', category: '成长与积分' },
        { id: 'ds_points', label: '会员积分', category: '成长与积分' },
        { id: 'ds_inviter', label: '邀请人', category: '推荐关系' },
        { id: 'ds_inviteCode', label: '邀请码', category: '推荐关系' },
        { id: 'ds_team', label: '下级/团队', category: '推荐关系' },
        { id: 'ds_commBal', label: '佣金余额', category: '推荐关系', sortable: true },
        { id: 'ds_balTreas', label: '余额', category: '余额宝', sortable: true },
        { id: 'ds_balInt', label: '利息', category: '余额宝', sortable: true },
        { id: 'ds_debt', label: '欠款', category: '信贷', sortable: true },
        { id: 'ds_creditVal', label: '信用值', category: '信贷', sortable: true },
        { id: 'ds_tags', label: '用户标签', category: '用户标签' },
        { id: 'ds_remark', label: '备注', category: '其他' },
        { id: 'ds_followup', label: '回访备注', category: '其他' },
    ].map(col => {
        if (!col.group) {
            col.group = col.category || '其他';
        }
        col.render = (user) => {
            let val = '-';
            let extraClass = 'cell-val';
            switch (col.id) {
                case 'ds_realname': val = renderDataState(user.realName, 'na'); break;
                case 'ds_birthday': val = user.birthday || '-'; break;
                case 'ds_accountType': val = user.accountType || '普通账号'; break;
                case 'ds_memberType': val = user.userType || '代理会员'; break;
                case 'ds_level': val = `<strong class="${user.level === '黄金会员' ? 'level-gold' : ''}">${user.level}</strong>`; break;
                case 'ds_regMode': val = user.registerMode || '一般注册'; break;
                case 'ds_nickname': val = renderDataState(user.nickname, 'na'); break;
                case 'ds_phone': val = renderDataState(user.phone, 'phone'); break;
                case 'ds_depTotal_main': val = formatAmount(user.deposit, user.currency); extraClass = 'cell-money text-blue'; break;
                case 'ds_depCount_main': val = user.depositCount || '0'; break;
                case 'ds_wdrTotal_main': val = formatAmount(user.withdraw, user.currency); extraClass = 'cell-money text-blue'; break;
                case 'ds_wdrCount_main': val = user.withdrawCount || '0'; break;
                case 'ds_wdrFee_main': val = formatAmount(user.withdrawPre, user.currency); extraClass = 'cell-money'; break;
                case 'ds_sysAdd_main': val = window.dataMode === 'nodata' ? '-' : formatAmount(user.adminAdd || 200, user.currency); extraClass = 'cell-money text-green'; break;
                case 'ds_sysSub_main': val = window.dataMode === 'nodata' ? '-' : formatAmount(user.adminDeduct || 0, user.currency); extraClass = 'cell-money text-red'; break;
                case 'ds_depTotal_summary': val = formatAmount(user.deposit, 'USDT'); extraClass = 'cell-money text-blue'; break;
                case 'ds_depCount_summary': val = user.depositCount || '0'; break;
                case 'ds_wdrTotal_summary': val = formatAmount(user.withdraw, 'USDT'); extraClass = 'cell-money text-blue'; break;
                case 'ds_wdrCount_summary': val = user.withdrawCount || '0'; break;
                case 'ds_wdrFee_summary': val = formatAmount(user.withdrawPre, 'USDT'); extraClass = 'cell-money'; break;
                case 'ds_sysAdd_summary': val = window.dataMode === 'nodata' ? '-' : formatAmount(user.adminAdd || 200, 'USDT'); extraClass = 'cell-money text-green'; break;
                case 'ds_sysSub_summary': val = window.dataMode === 'nodata' ? '-' : formatAmount(user.adminDeduct || 0, 'USDT'); extraClass = 'cell-money text-red'; break;
                case 'ds_growth': val = user.growth || '0'; break;
                case 'ds_vipGrowth': val = user.vipGrowth || '0'; break;
                case 'ds_points': val = user.points || '0'; break;
                case 'ds_inviter': val = user.inviter || '-'; break;
                case 'ds_inviteCode': val = user.inviteCode || '-'; break;
                case 'ds_team': val = `<a href="#" class="subordinate-link text-blue" style="text-decoration: underline;" data-uid="${user.uid}">${user.directTeam || '0/0'}</a>`; break;
                case 'ds_commBal': val = formatAmount(user.commissionBal, user.currency); extraClass = 'cell-money text-red'; break;
                case 'ds_balTreas': val = window.dataMode === 'nodata' ? '-' : formatAmount(user.balanceBuy || 15000, user.currency); extraClass = 'cell-money'; break;
                case 'ds_balInt': val = window.dataMode === 'nodata' ? '-' : formatAmount(user.interest || 35, user.currency); extraClass = 'cell-money text-green'; break;
                case 'ds_debt': val = formatAmount(user.arrears, user.currency); extraClass = 'cell-money text-red'; break;
                case 'ds_creditVal': val = formatAmount(user.creditValue, 'RMB'); extraClass = 'cell-val'; break;
                case 'ds_tags': val = (user.tags && user.tags.length > 0) ? user.tags.map(t => `<span class="user-custom-tag tag-blue" style="max-width: 100%; overflow: hidden; text-overflow: ellipsis;" title="${t}">${t}</span>`).join(' ') : '-'; break;
                case 'ds_remark': val = window.dataMode === 'nodata' ? '<span class="data-na">N/A</span>' : `<span title="${user.remark || ''}">${user.remark ? (user.remark.length > 20 ? user.remark.substring(0, 20) + '...' : user.remark) : '-'}</span>`; break;
                case 'ds_followup': val = window.dataMode === 'nodata' ? '<span class="data-na">N/A</span>' : `<span title="${user.followRemark || ''}">${user.followRemark ? (user.followRemark.length > 20 ? user.followRemark.substring(0, 20) + '...' : user.followRemark) : '-'}</span>`; break;
            }
            return `<td class="${extraClass}" data-col="${col.id}">${val}</td>`;
        };
        
        return col;
    });

    // Track which data source fields are visible in expanded cards (true=visible, false=hidden)
    let dataSourceFieldVisibility = { 'ds_debt': false, 'ds_creditVal': false };

    window.toggleDataSourceFieldVisibility = function (id) {
        dataSourceFieldVisibility[id] = dataSourceFieldVisibility[id] === false ? true : false;
        const nowVisible = dataSourceFieldVisibility[id] !== false;
        
        document.querySelectorAll(`.ds-field[data-ds-id="${id}"]`).forEach(el => {
            // For deposit/withdrawal card fields, use visibility+width instead of display
            // to avoid collapsing grid cells abruptly
            el.style.display = nowVisible ? '' : 'none';
        });
        
        // Custom logic for deposit/withdrawal card rows
        if (id.endsWith('_main') || id.endsWith('_summary')) {
            const baseId = id.replace('_main', '').replace('_summary', '');
            const mainVisible = dataSourceFieldVisibility[baseId + '_main'] !== false;
            const summaryVisible = dataSourceFieldVisibility[baseId + '_summary'] !== false;
            
            // Update using reliable data-ds-row + .ds-val-grid selectors
            document.querySelectorAll(`[data-ds-row="${baseId}"]`).forEach(row => {
                const valGrid = row.querySelector('.ds-val-grid');
                if (!mainVisible && !summaryVisible) {
                    row.style.display = 'none';
                } else {
                    row.style.display = 'flex';
                    if (valGrid) {
                        valGrid.style.gridTemplateColumns = (mainVisible && summaryVisible) ? '1fr 1fr' : '1fr';
                    }
                }
            });
        }
        
        // Update parent card visibility
        document.querySelectorAll('.detail-card').forEach(card => {
            if (card.dataset.category === '存取款资料') {
                const hasVisibleRow = Array.from(card.querySelectorAll('[data-ds-row]')).some(el => el.style.display !== 'none');
                card.style.display = hasVisibleRow ? 'flex' : 'none';
            } else if (card.dataset.category !== '其他' && card.dataset.category !== '用户标签') {
                const hasVisibleField = Array.from(card.querySelectorAll('.ds-field')).some(el => el.style.display !== 'none');
                card.style.display = hasVisibleField ? 'block' : 'none';
            } else if (card.dataset.category === '其他' || card.dataset.category === '用户标签') {
                const hasVisibleField = Array.from(card.querySelectorAll('.ds-field')).some(el => el.style.display !== 'none');
                // Other and User Tags cards have border:none or specific layouts, but their wrapper visibility applies normally
                card.style.display = hasVisibleField ? (card.dataset.category === '其他' ? 'block' : '') : 'none';
            }
        });
        
        renderDrawerStates();
        window.applyDrawerOrderToTable();
    };

    window.resetCustomColumns = function () {
        if (!confirm('确定要重置所有自订栏位设定吗？')) return;
        // Reset data source visibility
        dataSourceFieldVisibility = { 'ds_debt': false, 'ds_creditVal': false };
        renderDrawerStates();
        
        // Update all fields
        document.querySelectorAll('.ds-field').forEach(el => {
            const id = el.dataset.dsId || el.dataset.dsRow; // Handle basic fields and rows
            if (!id) return;
            const isVisible = dataSourceFieldVisibility[id] !== false;
            el.style.display = isVisible ? '' : 'none';
        });
        
        // Update parent card visibility
        document.querySelectorAll('.detail-card').forEach(card => {
            if (card.dataset.category === '存取款资料') {
                const hasVisibleRow = Array.from(card.querySelectorAll('[data-ds-row]')).some(el => el.style.display !== 'none');
                card.style.display = hasVisibleRow ? 'flex' : 'none';
            } else if (card.dataset.category !== '其他' && card.dataset.category !== '用户标签') {
                const hasVisibleField = Array.from(card.querySelectorAll('.ds-field')).some(el => el.style.display !== 'none');
                card.style.display = hasVisibleField ? 'block' : 'none';
            } else if (card.dataset.category === '其他' || card.dataset.category === '用户标签') {
                const hasVisibleField = Array.from(card.querySelectorAll('.ds-field')).some(el => el.style.display !== 'none');
                card.style.display = hasVisibleField ? (card.dataset.category === '其他' ? 'block' : '') : 'none';
            }
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
            const customColumnOverlay = document.getElementById('customColumnOverlay');
            if (customColumnOverlay) {
                customColumnOverlay.style.display = 'block';
                setTimeout(() => customColumnOverlay.style.opacity = '1', 10);
            }
            renderDrawerStates();
            window.applyDrawerOrderToTable();
        });

        btnCloseCustomColumnDrawer.addEventListener('click', () => {
            customColumnDrawer.classList.remove('show');
            customColumnDrawer.classList.remove('expanded');
            const customColumnOverlay = document.getElementById('customColumnOverlay');
            if (customColumnOverlay) {
                customColumnOverlay.style.opacity = '0';
                setTimeout(() => customColumnOverlay.style.display = 'none', 300);
            }
        });


        const customColumnOverlay = document.getElementById('customColumnOverlay');
        if (customColumnOverlay) {
            customColumnOverlay.addEventListener('click', () => {
                customColumnDrawer.classList.remove('show');
                customColumnDrawer.classList.remove('expanded');
                customColumnOverlay.style.opacity = '0';
                setTimeout(() => customColumnOverlay.style.display = 'none', 300);
            });
        }


        const backupFieldSearch = document.getElementById('backupFieldSearch');
        if (backupFieldSearch) {
            backupFieldSearch.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const items = document.getElementById('col3-backup-fields').children;
                for (let i = 0; i < items.length; i++) {
                    const text = items[i].innerText.toLowerCase();
                    items[i].style.display = text.includes(term) ? 'inline-flex' : 'none';
                }
            });
        }

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



    function renderPills(cols, isLeftPanel) {
        let html = '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
        cols.forEach(col => {
            const isMandatory = ['uid', 'account', 'action', 'memberInfo'].includes(col.id);
            const inMainTable = currentTableMode === 'nested' ? 
                nestedColumnsConfig.some(c => c.id === col.id) : 
                compactColumnsConfig.some(c => c.id === col.id);
            

                const isChecked = isLeftPanel ? (tableFieldVisibility[col.id] !== false) : (dataSourceFieldVisibility[col.id] !== false);
                const onChangeHtml = isLeftPanel ? `onchange="window.toggleTableFieldVisibility('${col.id}', this.checked)"` : `onchange="window.toggleDataSourceFieldVisibility('${col.id}')"`;
                
                const color = isChecked ? '#3b82f6' : '#64748b';
                const bg = isChecked ? '#eff6ff' : '#fff';
                const border = isChecked ? '#bfdbfe' : '#e2e8f0';
                
                html += `
                <div data-id="${col.id}" class="draggable-pill" draggable="true" style="display: inline-flex; cursor: grab;">
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
                    if (inMainTable) {
                        html += `<div style="background: #eef2ff; color: #4f46e5; font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-left: 4px; flex-shrink: 0;">已在主表</div>`;
                    } else {
                        html += `
                        <div style="display:flex; align-items:center; margin-left: 4px; border-left: 1px solid ${border}; padding-left: 6px;">
                            <button type="button" style="background:none; border:none; color:#3b82f6; cursor:pointer; padding: 0 4px; display:flex; align-items:center; justify-content:center;" onclick="window.promoteColumnFromCard('${col.id}')" title="加入表格"><i class="ph-bold ph-plus"></i></button>
                        </div>
                        `;
                    }
                }
                html += `
                    </label>
                </div>
                `;
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
            '其他': 'ph-bold ph-folder',
            '大头照': 'ph-bold ph-user-square',
            '账号信息': 'ph-bold ph-user',
            '基本资料': 'ph-bold ph-user',
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
            <div class="category-block-draggable" data-cat="${groupName}" draggable="${groupName !== '其他' ? 'true' : 'false'}" style="margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; background: #fdfdfd;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; cursor: ${groupName !== '其他' ? 'grab' : 'default'};">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        ${groupName !== '其他' ? '<i class="ph-bold ph-dots-six-vertical" style="color: #cbd5e1;"></i>' : ''}
                        <span style="font-size: 14px; font-weight: 600; color: #475569;">${groupName}</span>
                    </div>
                    ${groupName === '其他' ? '' : `<div style="display:flex; align-items:center; border: 1px solid #e2e8f0; background: #fff; border-radius: 6px; overflow: hidden;" onclick="event.stopPropagation()">
                        <button type="button" style="background:none; border:none; color:#94a3b8; cursor:pointer; padding: 4px 8px; border-right: 1px solid #e2e8f0; display:flex; align-items:center; justify-content:center;" onclick="${upFn}" title="向上移动"><i class="ph-bold ph-caret-up"></i></button>
                        <button type="button" style="background:none; border:none; color:#94a3b8; cursor:pointer; padding: 4px 8px; display:flex; align-items:center; justify-content:center;" onclick="${downFn}" title="向下移动"><i class="ph-bold ph-caret-down"></i></button>
                    </div>`}
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
                <div style="padding-top: 4px;">
                    ${renderPills(cols, isLeftPanel)}
                </div>
            `;
        }
        innerHtml += `</div>`;
        return innerHtml;
    }

    function renderDrawerStates() {
        const col1 = document.getElementById('col1-table-fields');
        const col2 = document.getElementById('col2-card-fields');

        if (!col1 || !col2) return;

        col1.innerHTML = '';
        col2.innerHTML = '';

        const list = currentTableMode === 'nested' ? nestedColumnsConfig : compactColumnsConfig;
        
        // --- Left Panel ---
        const leftGroups = {};
        const leftGroupOrder = [];
        list.forEach(col => {
            if (['action'].includes(col.id)) return;
            const grp = col.category || col.group || '其他';
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
    window.moveColumnLeft = function (id) {
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
            const grp = col.category || col.group || '其他';
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
            const grp = col.category || col.group || '其他';
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
        if (catName === '其他') return; // Cannot move 其他 up
        const idx = drawerCategoryOrder.indexOf(catName);
        if (idx > 0) {
            if (drawerCategoryOrder[idx - 1] === '其他') return; // Cannot swap with 其他
            const temp = drawerCategoryOrder[idx - 1];
            drawerCategoryOrder[idx - 1] = drawerCategoryOrder[idx];
            drawerCategoryOrder[idx] = temp;
            renderDrawerStates();
            if(typeof window.applyDrawerOrderToTable === 'function') window.applyDrawerOrderToTable();
        }
    };

    window.moveRightCategoryDown = function(catName) {
        if (catName === '其他') return; // Cannot move 其他 down
        const idx = drawerCategoryOrder.indexOf(catName);
        if (idx > -1 && idx < drawerCategoryOrder.length - 1) {
            if (drawerCategoryOrder[idx + 1] === '其他') return; // Cannot swap with 其他
            const temp = drawerCategoryOrder[idx + 1];
            drawerCategoryOrder[idx + 1] = drawerCategoryOrder[idx];
            drawerCategoryOrder[idx] = temp;
            renderDrawerStates();
            if(typeof window.applyDrawerOrderToTable === 'function') window.applyDrawerOrderToTable();
        }
    };

    window.demoteColumnToCard = function (id) {
        let list = currentTableMode === 'nested' ? nestedColumnsConfig : compactColumnsConfig;
        const idx = list.findIndex(c => c.id === id);
        if (idx > -1) {
            list.splice(idx, 1);
            if (currentTableMode === 'compact' && typeof compactColumnVisibility !== 'undefined') {
                compactColumnVisibility[id] = false;
            } else if (currentTableMode === 'nested' && typeof nestedColumnVisibility !== 'undefined') {
                nestedColumnVisibility[id] = false;
            }
            renderDrawerStates();
            updateTableFromDrawer();
            if(typeof window.applyDrawerOrderToTable === 'function') window.applyDrawerOrderToTable();
        }
    };

    window.promoteColumnFromCard = function (id) {
        let list = currentTableMode === 'nested' ? nestedColumnsConfig : compactColumnsConfig;
        const col = availableDataSource.find(c => c.id === id);
        if (col && !list.some(c => c.id === id)) {
            const grp = col.group || col.category || '其他';
            
            // Find the last index of a column in the same group
            let insertIdx = -1;
            for (let i = list.length - 1; i >= 0; i--) {
                const c = list[i];
                const cGrp = c.group || c.category || '其他';
                if (cGrp === grp && c.id !== 'action') {
                    insertIdx = i + 1;
                    break;
                }
            }

            if (insertIdx !== -1) {
                list.splice(insertIdx, 0, col);
            } else {
                // insert before action if no existing group found
                const actionIdx = list.findIndex(c => c.id === 'action');
                if (actionIdx > -1) {
                    list.splice(actionIdx, 0, col);
                } else {
                    list.push(col);
                }
            }
            
            if (currentTableMode === 'compact' && typeof compactColumnVisibility !== 'undefined') {
                compactColumnVisibility[id] = true;
            } else if (currentTableMode === 'nested' && typeof nestedColumnVisibility !== 'undefined') {
                nestedColumnVisibility[id] = true;
            }
            // Reset the right-panel checkbox visibility just in case it was explicitly hidden there
            dataSourceFieldVisibility[id] = true; 
            renderDrawerStates();
            updateTableFromDrawer();
            if(typeof window.applyDrawerOrderToTable === 'function') window.applyDrawerOrderToTable();
        }
    };

    function updateTableFromDrawer() {
        if (typeof renderTable === 'function') {
            renderTable(true);
        }
    }

    window.toggleDrawerCategory = function (category, isVisible) {
        availableDataSource.forEach(col => {
            if ((col.category || '其他') === category) {
                dataSourceFieldVisibility[col.id] = isVisible;
            }
        });
        renderDrawerStates();
        updateTableFromDrawer();
    };

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

    const walletDetailModal = document.getElementById('walletDetailModal');
    const walletDetailTitle = document.getElementById('walletDetailTitle');
    const walletDetailCurrency = document.getElementById('walletDetailCurrency');
    const walletDetailBody = document.getElementById('walletDetailBody');
    const btnWalletDetailClose = document.getElementById('btnWalletDetailClose');

    window.openWalletDetailModal = function (title, wallet, mainAmount) {
        if (!walletDetailModal) return;
        walletDetailTitle.textContent = title;
        walletDetailCurrency.textContent = wallet;

        // Formatted amount if it's a number string
        let formattedMain = mainAmount;
        if (!isNaN(parseFloat(mainAmount)) && mainAmount.toString().indexOf(',') === -1 && mainAmount !== '-') {
            formattedMain = parseFloat(mainAmount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        }

        // Use mock data mimicking the screenshot
        const mockCurrencies = [
            { curr: 'RMB', val: wallet === 'RMB' ? formattedMain : '2,727' },
            { curr: 'VND', val: '22,326,998' },
            { curr: 'PHP', val: '11,039' },
            { curr: 'MYR', val: '420.69' },
            { curr: 'USDT', val: wallet === 'USDT' ? formattedMain : '51.62' }
        ];

        let html = '';
        mockCurrencies.forEach(item => {
            html += `<tr class="wallet-detail-table-row">
                <td>${item.curr}</td>
                <td>${item.val}</td>
            </tr>`;
        });
        walletDetailBody.innerHTML = html;

        walletDetailModal.classList.add('show');
    };

    if (btnWalletDetailClose) {
        btnWalletDetailClose.addEventListener('click', () => {
            walletDetailModal.classList.remove('show');
        });
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

    // Add global event listener for unit dropdowns
    document.addEventListener('click', function(e) {
        // Handle dropdown toggle
        const btn = e.target.closest('.custom-unit-dropdown button');
        if (btn) {
            const dropdown = btn.closest('.custom-unit-dropdown');
            const menu = dropdown.querySelector('.dropdown-menu');
            // Close all other menus
            document.querySelectorAll('.custom-unit-dropdown .dropdown-menu').forEach(m => {
                if (m !== menu) m.style.display = 'none';
            });
            
            if (menu.style.display === 'none') {
                const rect = btn.getBoundingClientRect();
                menu.style.position = 'fixed';
                menu.style.top = (rect.bottom + 4) + 'px';
                menu.style.left = (rect.right - 120) + 'px';
                menu.style.width = '120px';
                menu.style.zIndex = '99999';
                menu.style.display = 'block';
            } else {
                menu.style.display = 'none';
            }
            return;
        }

        // Handle unit selection
        const item = e.target.closest('.dropdown-menu .dropdown-item');
        if (item) {
            const dropdown = item.closest('.custom-unit-dropdown');
            const btn = dropdown.querySelector('button');
            const menu = dropdown.querySelector('.dropdown-menu');
            const newUnit = item.getAttribute('data-value');
            
            // Update button text
            const valSpan = btn.querySelector('.selected-val') || btn.querySelector('span');
            if (valSpan) {
                valSpan.textContent = newUnit;
            }
            
            // Update checkmarks and colors
            menu.querySelectorAll('.dropdown-item').forEach(el => {
                const icon = el.querySelector('i.ph-check');
                if (icon) {
                    if (el === item) {
                        icon.style.display = 'inline-block';
                        el.style.background = '#f8fafc';
                        el.style.color = '#4f46e5';
                    } else {
                        icon.style.display = 'none';
                        el.style.background = 'transparent';
                        el.style.color = '#334155';
                    }
                }
            });
            
            // Hide menu
            menu.style.display = 'none';
            
            // Re-format amount fields in this card
            const cardBody = dropdown.closest('.detail-card').querySelector('.detail-card-body');
            const expandedRow = dropdown.closest('.expanded-detail-row');
            if (!expandedRow) return;
            
            const prevRow = expandedRow.previousElementSibling;
            const btnExpand = prevRow ? prevRow.querySelector('.expand-btn') : null;
            const uid = btnExpand ? btnExpand.getAttribute('data-uid') : null;
            if (!uid || typeof window.mockUsers === 'undefined') return;
            
            const user = window.mockUsers.find(u => u.uid == uid);
            if (user && cardBody) {
                // Mock exchange rates relative to USDT
                const rates = { USDT: 1, RMB: 7.2, VND: 25000, PHP: 58, MYR: 4.7 };
                const baseRate = rates[user.currency || 'RMB'] || 1;
                const targetRate = rates[newUnit] || 1;
                const conversionFactor = targetRate / baseRate;
                
                // Update micro-header currency labels
                const labels = cardBody.querySelectorAll('.main-currency-label');
                labels.forEach(l => l.textContent = newUnit);

                // Synchronize all dropdown titles and checkmarks in this card
                cardBody.querySelectorAll('.custom-unit-dropdown').forEach(dd => {
                    const titleSpan = dd.querySelector('.dropdown-title');
                    if (titleSpan) {
                        const mainCurrency = dd.getAttribute('data-main-currency');
                        if (newUnit === mainCurrency) {
                            titleSpan.textContent = '主钱包';
                        } else {
                            titleSpan.textContent = '钱包';
                        }
                    }
                    dd.querySelectorAll('.dropdown-item').forEach(el => {
                        const icon = el.querySelector('i.ph-check');
                        if (icon) {
                            if (el.getAttribute('data-value') === newUnit) {
                                icon.style.display = 'inline-block';
                                el.style.background = '#f8fafc';
                                el.style.color = '#4f46e5';
                            } else {
                                icon.style.display = 'none';
                                el.style.background = 'transparent';
                                el.style.color = '#334155';
                            }
                        }
                    });
                });

                // Find all amount fields in this card and re-render them
                const dsFields = cardBody.querySelectorAll('.ds-field');
                dsFields.forEach(field => {
                    const dsId = field.getAttribute('data-ds-id');
                    const valSpan = field.querySelector('.val');
                    if (!valSpan) return;
                    
                    let rawVal = null;
                    let isAmount = false;
                    
                    switch(dsId) {
                        case 'ds_depTotal_main': rawVal = user.deposit; isAmount = true; break;
                        case 'ds_wdrTotal_main': rawVal = user.withdraw; isAmount = true; break;
                        case 'ds_wdrFee_main': rawVal = user.withdrawPre; isAmount = true; break;
                        case 'ds_sysAdd_main': rawVal = user.adminAdd !== undefined ? user.adminAdd : 200; isAmount = true; break;
                        case 'ds_sysSub_main': rawVal = user.adminDeduct !== undefined ? user.adminDeduct : 0; isAmount = true; break;
                        case 'ds_commBal': rawVal = user.commissionBal; isAmount = true; break;
                        case 'ds_balTreas': rawVal = 15000; isAmount = true; break;
                        case 'ds_balInt': rawVal = 35; isAmount = true; break;
                        case 'ds_debt': rawVal = user.arrears; isAmount = true; break;
                    }
                    
                    if (isAmount) {
                        if (window.dataMode === 'nodata' && (dsId === 'ds_sysAdd_main' || dsId === 'ds_sysSub_main' || dsId === 'ds_balTreas' || dsId === 'ds_balInt')) {
                            // Keep nodata '-'
                        } else if (rawVal === '-' || rawVal === '获取失败' || rawVal === '载入中' || rawVal === undefined || rawVal === null) {
                            valSpan.textContent = '-';
                        } else {
                            let parsedVal = parseFloat(rawVal) || 0;
                            let convertedVal = parsedVal * conversionFactor;
                            if (typeof formatAmount === 'function') {
                                valSpan.textContent = formatAmount(convertedVal, newUnit);
                            }
                        }
                    }
                });
            }
            return;
        }

        // Click outside closes menus
        document.querySelectorAll('.custom-unit-dropdown .dropdown-menu').forEach(m => {
            m.style.display = 'none';
        });
    });

    // Close menus on any scroll to prevent floating detached menus
    document.addEventListener('scroll', function() {
        document.querySelectorAll('.custom-unit-dropdown .dropdown-menu').forEach(m => {
            m.style.display = 'none';
        });
    }, true);

    // --- Drag and Drop Logic ---
    let draggedElement = null;
    let dragType = null; // 'pill' or 'category'

    document.addEventListener('dragstart', (e) => {
        const pill = e.target.closest('.draggable-pill');
        const cat = e.target.closest('.category-block-draggable');
        
        if (pill) {
            draggedElement = pill;
            dragType = 'pill';
            pill.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', 'pill');
        } else if (cat) {
            draggedElement = cat;
            dragType = 'category';
            cat.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', 'category');
        }
    });

    document.addEventListener('dragend', (e) => {
        if (draggedElement) {
            draggedElement.style.opacity = '1';
            draggedElement = null;
            dragType = null;
        }
    });

    document.addEventListener('dragover', (e) => {
        e.preventDefault(); // allow drop
        e.dataTransfer.dropEffect = 'move';
    });
    
    document.addEventListener('dragenter', (e) => {
        e.preventDefault();
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedElement) return;

        if (dragType === 'pill') {
            const dropTarget = e.target.closest('.draggable-pill');
            if (dropTarget && dropTarget !== draggedElement) {
                const idFrom = draggedElement.getAttribute('data-id');
                const idTo = dropTarget.getAttribute('data-id');
                
                // Only allow swapping in the left panel (main table columns)
                let list = currentTableMode === 'nested' ? nestedColumnsConfig : compactColumnsConfig;
                
                const idxFrom = list.findIndex(c => c.id === idFrom);
                const idxTo = list.findIndex(c => c.id === idTo);
                
                if (idxFrom !== -1 && idxTo !== -1) {
                    const temp = list[idxFrom];
                    list[idxFrom] = list[idxTo];
                    list[idxTo] = temp;
                    renderDrawerStates();
                    updateTableFromDrawer();
                }
            }
        } else if (dragType === 'category') {
            const dropTarget = e.target.closest('.category-block-draggable');
            if (dropTarget && dropTarget !== draggedElement) {
                const catFrom = draggedElement.getAttribute('data-cat');
                const catTo = dropTarget.getAttribute('data-cat');
                
                if (catFrom === '其他' || catTo === '其他') return; // Do not move '其他'
                
                const isLeftPanel = draggedElement.closest('#col1-table-fields') !== null;
                const dropTargetIsLeftPanel = dropTarget.closest('#col1-table-fields') !== null;
                
                // Prevent dragging between left and right panels
                if (isLeftPanel !== dropTargetIsLeftPanel) return;

                if (isLeftPanel) {
                    let list = currentTableMode === 'nested' ? nestedColumnsConfig : compactColumnsConfig;
                    const leftGroups = {};
                    const leftGroupOrder = [];
                    list.forEach(col => {
                        if (['action'].includes(col.id)) return;
                        const grp = col.category || col.group || '其他';
                        if (!leftGroups[grp]) {
                            leftGroups[grp] = [];
                            leftGroupOrder.push(grp);
                        }
                        leftGroups[grp].push(col);
                    });
                    
                    const idxFrom = leftGroupOrder.indexOf(catFrom);
                    const idxTo = leftGroupOrder.indexOf(catTo);
                    
                    if (idxFrom !== -1 && idxTo !== -1) {
                        const temp = leftGroupOrder[idxFrom];
                        leftGroupOrder[idxFrom] = leftGroupOrder[idxTo];
                        leftGroupOrder[idxTo] = temp;
                        
                        const newList = [];
                        leftGroupOrder.forEach(grp => {
                            newList.push(...leftGroups[grp]);
                        });
                        
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
                } else {
                    const idxFrom = drawerCategoryOrder.indexOf(catFrom);
                    const idxTo = drawerCategoryOrder.indexOf(catTo);
                    
                    if (idxFrom !== -1 && idxTo !== -1) {
                        const temp = drawerCategoryOrder[idxFrom];
                        drawerCategoryOrder[idxFrom] = drawerCategoryOrder[idxTo];
                        drawerCategoryOrder[idxTo] = temp;
                        renderDrawerStates();
                        if(typeof window.applyDrawerOrderToTable === 'function') window.applyDrawerOrderToTable();
                    }
                }
            }
        }
    });

});