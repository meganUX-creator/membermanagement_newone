function test() {
                // 1. 新增会员按钮 (trace 2)
                if (btnAddMember) {
                    const showAdd = localStorage.getItem('perm-2') !== 'false';
                    btnAddMember.style.display = showAdd ? '' : 'none';
                }