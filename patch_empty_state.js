const fs = require('fs');

// 1. Modify content.html
let html = fs.readFileSync('content.html', 'utf8');

// Replace filter row
const filterRowStart = html.indexOf('<div class="filter-row">');
const filterActionsStart = html.indexOf('<div class="filter-actions-row">');

const newFilterRowHtml = `
                <div class="filter-row" style="grid-template-columns: repeat(4, 1fr);">
                    <!-- Row 1 -->
                    <div class="form-group" data-filter-id="status">
                        <div class="custom-select-single" id="dropdownStatus">
                            <div class="select-selected"><span class="selected-val">请选择状态</span><i class="ph ph-caret-down"></i></div>
                            <ul class="select-options"><li data-value="" class="active">请选择状态</li><li data-value="正常">正常</li><li data-value="冻结">冻结</li><li data-value="停用">停用</li></ul>
                        </div>
                    </div>
                    <div class="form-group" data-filter-id="level">
                        <div class="custom-select-single" id="dropdownLevel">
                            <div class="select-selected"><span class="selected-val">请选择用户层级</span><i class="ph ph-caret-down"></i></div>
                            <ul class="select-options"><li data-value="" class="active">请选择用户层级</li><li data-value="普通会员">普通会员</li><li data-value="VIP会员">VIP会员</li><li data-value="黄金会员">黄金会员</li></ul>
                        </div>
                    </div>
                    <div class="form-group" data-filter-id="vip">
                        <div class="custom-select-single" id="dropdownLevel2">
                            <div class="select-selected"><span class="selected-val">请选择用户等级</span><i class="ph ph-caret-down"></i></div>
                            <ul class="select-options">
                                <li data-value="" class="active">请选择用户等级</li>
                                <li data-value="普通会员">普通会员</li>
                                <li data-value="白银会员">白银会员</li>
                                <li data-value="黄金会员">黄金会员</li>
                                <li data-value="铂金会员">铂金会员</li>
                                <li data-value="钻石会员">钻石会员</li>
                                <li data-value="至尊会员">至尊会员</li>
                            </ul>
                        </div>
                    </div>
                    <div class="form-group" data-filter-id="other">
                        <div class="custom-select-single" id="dropdownExclude">
                            <div class="select-selected"><span class="selected-val">请选择排除条件</span><i class="ph ph-caret-down"></i></div>
                            <ul class="select-options">
                                <li data-value="" class="active">请选择排除条件</li>
                                <li data-value="测试帐号">测试帐号</li>
                                <li data-value="未充值玩家">未充值玩家</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Row 2 -->
                    <div class="form-group" data-filter-id="deviceType">
                         <div class="custom-select-single" id="dropdownDeviceType">
                             <div class="select-selected"><span class="selected-val">请选择设备类型</span><i class="ph ph-caret-down"></i></div>
                             <ul class="select-options"><li data-value="" class="active">请选择设备类型</li><li data-value="PC">PC</li><li data-value="H5">H5</li><li data-value="APP">APP</li></ul>
                         </div>
                    </div>
                    <div class="form-group" data-filter-id="country">
                         <div class="custom-select-single" id="dropdownCountry">
                             <div class="select-selected"><span class="selected-val">请选择国家</span><i class="ph ph-caret-down"></i></div>
                             <ul class="select-options"><li data-value="" class="active">请选择国家</li><li data-value="中国">中国</li><li data-value="越南">越南</li></ul>
                         </div>
                    </div>
                    <div class="form-group" data-filter-id="tagsSearch">
                        <div class="custom-select-single" id="dropdownUserTag">
                            <div class="select-selected"><span class="selected-val">请选择用户标签</span><i class="ph ph-caret-down"></i></div>
                            <ul class="select-options"><li data-value="" class="active">请选择用户标签</li><li data-value="高价值">高价值</li><li data-value="风险">风险</li><li data-value="活跃">活跃</li></ul>
                        </div>
                    </div>
                    <div class="form-group" data-filter-id="agentAccount">
                        <div class="input-with-inline-label" style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 0 12px; display: flex; align-items: center; height: 32px;">
                            <span class="inline-label" style="font-weight: 600; font-size: 13px; color: #1f2937; margin-right: 4px;">推广人账号：</span>
                            <input type="text" placeholder="请输入推广人账号" id="inputAgentAccountOuter" style="border: none; flex: 1; outline: none; background: transparent; font-size: 13px;">
                        </div>
                    </div>

                    <!-- Row 3 -->
                    <div class="form-group" data-filter-id="notLoginDays">
                        <div class="input-with-inline-label" style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 0 12px; display: flex; align-items: center; height: 32px;">
                            <span class="inline-label" style="font-weight: 600; font-size: 13px; color: #1f2937; margin-right: 4px;">未登录天数：</span>
                            <input type="text" placeholder="请输入未登录天数" id="inputOfflineDaysOuter" style="border: none; flex: 1; outline: none; background: transparent; font-size: 13px;">
                        </div>
                    </div>
                    <div class="form-group" data-filter-id="registerTime" style="grid-column: span 2;">
                        <div class="input-with-inline-label" style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 0 12px; display: flex; align-items: center; height: 32px;">
                            <span class="inline-label" style="font-weight: 600; font-size: 13px; color: #1f2937; margin-right: 4px;">注册时间：</span>
                            <div class="date-range-container" style="flex:1; display: flex; align-items: center;">
                                <i class="ph ph-calendar-blank" style="margin-right: 8px; color: #1f2937;"></i>
                                <input type="text" class="date-text" id="inputDateStartOuter" placeholder="年 / 月 / 日" onfocus="(this.type='date')" onblur="(this.value==''?this.type='text':'')" style="border:none; outline:none; background:transparent; width: 100%; text-align: center; font-size: 13px;">
                                <span class="date-separator-line" style="margin: 0 12px;"> ~ </span>
                                <input type="text" class="date-text" id="inputDateEndOuter" placeholder="年 / 月 / 日" onfocus="(this.type='date')" onblur="(this.value==''?this.type='text':'')" style="border:none; outline:none; background:transparent; width: 100%; text-align: center; font-size: 13px;">
                                <i class="ph ph-calendar-blank" style="margin-left: 12px; color: #1f2937;"></i>
                            </div>
                        </div>
                    </div>
                </div>

                `;

html = html.substring(0, filterRowStart) + newFilterRowHtml + html.substring(filterActionsStart);

// Handle Empty state DOM injection
const tableGroupStart = '<div class="table-and-filter-group">';
const emptyStateHtml = `
                <!-- 无数据状态 (Empty State) -->
                <div class="empty-state" id="emptyDataState" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 24px; background: transparent; border-radius: 12px; margin-top: 24px;">
                    <div class="empty-icon" style="font-size: 64px; color: #cbd5e1; margin-bottom: 16px;"><i class="ph-fill ph-tray"></i></div>
                    <div class="empty-text" style="color: #64748b; font-size: 15px; font-weight: 500;">暂无数据，请输入条件后按查询</div>
                </div>

                <!-- 有数据时的列表 (Hidden initially) -->
                <div class="table-and-filter-group" id="tableDataGroup" style="display: none;">`;

html = html.replace(tableGroupStart, emptyStateHtml);
html = html.replace('<div class="bottom-stats-bar" id="bottomStatsBar">', '<div class="bottom-stats-bar" id="bottomStatsBar" style="display: none;">');

fs.writeFileSync('content.html', html);

// 2. Modify script.js to wire up search button
let js = fs.readFileSync('script.js', 'utf8');

const scriptPatch = `
// Append to end of script
document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btnSearch');
    const tableDataGroup = document.getElementById('tableDataGroup');
    const emptyDataState = document.getElementById('emptyDataState');
    const bottomStatsBar = document.getElementById('bottomStatsBar');
    
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            if(tableDataGroup) tableDataGroup.style.display = 'block';
            if(emptyDataState) emptyDataState.style.display = 'none';
            if(bottomStatsBar) bottomStatsBar.style.display = 'flex';
        });
    }
});
`;

if (!js.includes('emptyDataState')) {
    fs.writeFileSync('script.js', js + '\n' + scriptPatch);
}
console.log('done');
