
        document.addEventListener('DOMContentLoaded', () => {
            const btnAddMember = document.getElementById('btnAddMember');
            const batchContainer = document.querySelector('.batch-dropdown-container');
            const exportContainer = document.querySelector('.export-dropdown-container');
            
            function updatePermissions() {
                // 1. 新增会员按钮 (trace 2)
                if (btnAddMember) {
                    const showAdd = localStorage.getItem('perm-2') !== 'false';
                    btnAddMember.style.display = showAdd ? '' : 'none';
                }
                
                // 2. 批量操作按钮与下拉选单项目 (trace 12, 14, 24, 43, 44)
                if (batchContainer) {
                    const p12 = localStorage.getItem('perm-12') !== 'false';
                    const p14 = localStorage.getItem('perm-14') !== 'false';
                    const p24 = localStorage.getItem('perm-24') !== 'false';
                    const p43 = localStorage.getItem('perm-43') !== 'false';
                    const p44 = localStorage.getItem('perm-44') !== 'false';
                    
                    // 如果这五个权限有任何一个是开启的，就显示；否则隐藏整组
                    const showBatch = p12 || p14 || p24 || p43 || p44;
                    batchContainer.style.display = showBatch ? '' : 'none';
                    
                    // 个别控制下拉选单项目
                    const item12 = document.getElementById('batchItem-12');
                    if (item12) item12.style.display = p12 ? '' : 'none';
                    
                    const item14 = document.getElementById('batchItem-14');
                    if (item14) item14.style.display = p14 ? '' : 'none';
                    
                    const item24 = document.getElementById('batchItem-24');
                    if (item24) item24.style.display = p24 ? '' : 'none';
                    
                    const item43 = document.getElementById('batchItem-43');
                    if (item43) item43.style.display = p43 ? '' : 'none';
                    
                    const item44 = document.getElementById('batchItem-44');
                    if (item44) item44.style.display = p44 ? '' : 'none';
                }
                
                // 3. 导出数据按钮 (trace 13)
                if (exportContainer) {
                    const showExport = localStorage.getItem('perm-13') !== 'false';
                    exportContainer.style.display = showExport ? '' : 'none';
                }

                // 4. 动态搜寻栏位权限控制
                // 独立搜寻栏位 (Trace: 17, 3)
                const p17 = localStorage.getItem('perm-17') !== 'false';
                const p3 = localStorage.getItem('perm-3') !== 'false';
                const showIndependentFields = p17 || p3;
                const independentFields = ['birthday', 'bankCard', 'depositAmount', 'loginIp'];
                independentFields.forEach(id => {
                    // 表单群组 (搜寻栏位)
                    const el = document.querySelector(`.form-group[data-filter-id="${id}"]`);
                    if (el) el.style.display = showIndependentFields ? '' : 'none';

                    // 自订筛选维度弹窗内的选项
                    const modalCheckbox = document.querySelector(`.checkbox-item input[value="${id}"]`);
                    if (modalCheckbox) {
                        const parentLabel = modalCheckbox.closest('.checkbox-item');
                        if (parentLabel) parentLabel.style.display = showIndependentFields ? '' : 'none';
                    }
                });

                // 下拉选单项目
                // Trace 20 (手机号, 邮箱, Zalo, WhatsApp, Telegram)
                const showContactInfo = localStorage.getItem('perm-20') !== 'false';
                const contactInfoItems = ['phone', 'email', 'zalo', 'whatsapp', 'telegram'];
                contactInfoItems.forEach(value => {
                    const el = document.querySelector(`#accountTypeMenu li[data-value="${value}"]`);
                    if (el) el.style.display = showContactInfo ? '' : 'none';
                });

                // Trace 37 (真实姓名)
                const showRealName = localStorage.getItem('perm-37') !== 'false';
                const realNameEl = document.querySelector(`#accountTypeMenu li[data-value="realName"]`);
                if (realNameEl) realNameEl.style.display = showRealName ? '' : 'none';


                // Trace 31 (谷歌验证码)
                const showGoogleCode = localStorage.getItem('perm-31') !== 'false';
                const googleCodeEl = document.querySelector(`#accountTypeMenu li[data-value="googleCode"]`);
                if (googleCodeEl) googleCodeEl.style.display = showGoogleCode ? '' : 'none';

                // Trace 4 (支付层级)
                const p4 = localStorage.getItem('perm-4') !== 'false';
                const editFormPayLevel = document.getElementById('editFormPayLevel');
                if (editFormPayLevel) {
                    editFormPayLevel.disabled = !p4;
                    // Apply a visual cue for disabled state
                    if (!p4) {
                        editFormPayLevel.style.backgroundColor = 'var(--bg-color)';
                        editFormPayLevel.style.cursor = 'not-allowed';
                        editFormPayLevel.style.opacity = '0.6';
                    } else {
                        editFormPayLevel.style.backgroundColor = '';
                        editFormPayLevel.style.cursor = '';
                        editFormPayLevel.style.opacity = '';
                    }
                }
                
                // If the currently active dropdown option is hidden, reset to 'exact'
                const activeAccountType = document.querySelector('#accountTypeMenu li.active');
                if (activeAccountType && activeAccountType.style.display === 'none') {
                    const exactItem = document.querySelector('#accountTypeMenu li[data-value="exact"]');
                    if (exactItem) exactItem.click();
                }
                
                // Trace 37 (Real Name form and details toggle)
                const detailsRealName = document.getElementById('detailsRealName');
                if (detailsRealName) {
                    const rawVal = detailsRealName.getAttribute('data-val');
                    detailsRealName.innerHTML = showRealName ? window.renderDataState(rawVal) : window.renderDataState(window.maskRealName(rawVal));
                }
                const editFormRealName = document.getElementById('editFormRealName');
                if (editFormRealName) {
                    const rawVal = editFormRealName.getAttribute('data-val');
                    if (showRealName) {
                        editFormRealName.value = (rawVal && rawVal !== '-') ? rawVal : '';
                        editFormRealName.disabled = false;
                    } else {
                        editFormRealName.value = (rawVal && rawVal !== '-') ? rawVal : '';
                        editFormRealName.disabled = true;
                    }
                }
                

                // Trace 36 (Phone Edit)
                const showPhoneEdit = localStorage.getItem('perm-36') !== 'false';
                const editFormPhone = document.getElementById('editFormPhone');
                if (editFormPhone) {
                    const rawVal = editFormPhone.getAttribute('data-val');
                    const isUnverified = !rawVal || rawVal === '-' || rawVal === '未验证' || rawVal === '末绑定' || rawVal === '未绑定' || rawVal === '待重新绑定' || rawVal === '审核中';
                    if (isUnverified) {
                        editFormPhone.value = '-';
                    } else {
                        editFormPhone.value = rawVal;
                    }
                    
                    if (showPhoneEdit) {
                        editFormPhone.disabled = false;
                    } else {
                        editFormPhone.disabled = true;
                    }
                }
                
                // Trace 27 (Audit Info toggle)
                const p27 = localStorage.getItem('perm-27') !== 'false';
                const detailsAuditTabBtn = document.getElementById('detailsAuditTabBtn');
                if (detailsAuditTabBtn) {
                    detailsAuditTabBtn.style.display = p27 ? '' : 'none';
                    if (!p27 && detailsAuditTabBtn.classList.contains('active')) {
                        const basicTabBtn = document.querySelector('.user-details-tab-item[data-target="detailsBasic"]');
                        if (basicTabBtn) basicTabBtn.click();
                    }
                }
                
                // Trace 20 (Contact Info Card toggle)
                const p20 = localStorage.getItem('perm-20') !== 'false';
                const detailsContactInfoCard = document.getElementById('detailsContactInfoCard');
                if (detailsContactInfoCard) {
                    detailsContactInfoCard.style.display = p20 ? '' : 'none';
                }
                const editContactInfoCard = document.getElementById('editContactInfoCard');
                if (editContactInfoCard) {
                    editContactInfoCard.style.display = p20 ? '' : 'none';
                }
            }

            // 初始设定
            updatePermissions();
            
            // 监听来自 index.html 的 postMessage (Works reliably on file:// protocol)
            window.addEventListener('message', (e) => {
                if (e.data && e.data.type === 'permission_change') {
                    localStorage.setItem('perm-' + e.data.traceId, e.data.checked);
                    updatePermissions();
                    if (typeof window.renderTable === 'function') window.renderTable();
                    if (typeof window.renderCompactActionMenu === 'function') window.renderCompactActionMenu();
                } else if (e.data && e.data.type === 'stats_visibility') {
                    const statsBar = document.getElementById('bottomStatsBar');
                    if (statsBar) {
                        statsBar.style.display = e.data.visible ? 'flex' : 'none';
                    }
                }
            });
        });
    