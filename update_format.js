const fs = require('fs');
let content = fs.readFileSync('script.js', 'utf8');

// Update formatAmount definition
content = content.replace(
    /function formatAmount\(val\) \{[\s\S]*?return num\.toLocaleString\('en-US', \{ minimumFractionDigits: 2, maximumFractionDigits: 2 \}\);\n    \}/,
    `function formatAmount(val, currency) {
        if (window.dataMode === 'nodata') return '-';
        if (val === undefined || val === null || val === '-' || val === '' || val === '无数据') return val;
        let num = parseFloat(val);
        if (isNaN(num)) return val;
        
        if (currency === 'USDT') {
            return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
            return Math.floor(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }
    }`
);

// We need to pass user.currency to formatAmount everywhere it's called with user.*
// Exception: in '资金与存取款', we always pass 'USDT'
// The '资金与存取款' fields are: ds_depTotal, ds_wdrTotal, ds_wdrFee, ds_sysAdd, ds_sysSub, deposit, withdraw
// Wait, the compact/nested tables also have deposit/withdraw. Are they always USDT?
// The user said "這個卡片在任何的幣種下單位都是USDT。" meaning ONLY the detail card? Or the whole system?
// "USDT單位相關的金額字段，都會出現小數點後兩位" (Amounts with USDT unit will have 2 decimals).
// So let's just pass `user.currency` everywhere, EXCEPT where we know it's always USDT.
// Actually, it's safer to just replace `formatAmount(x)` with `formatAmount(x, user.currency)` everywhere first,
// then manually fix the ones in '资金与存取款' to `formatAmount(x, 'USDT')`.

content = content.replace(/formatAmount\((user\.[a-zA-Z0-9_]+)\)/g, 'formatAmount($1, user.currency)');
content = content.replace(/formatAmount\((user\.[a-zA-Z0-9_]+\s*\|\|\s*0)\)/g, 'formatAmount($1, user.currency)');
content = content.replace(/formatAmount\((200|0|15000|35)\)/g, "formatAmount($1, user.currency)");

// Now fix the ones in 资金与存取款 detail card (lines ~1830)
content = content.replace(/formatAmount\(user\.deposit, user\.currency\)/g, "formatAmount(user.deposit, 'USDT')");
content = content.replace(/formatAmount\(user\.withdraw, user\.currency\)/g, "formatAmount(user.withdraw, 'USDT')");
content = content.replace(/formatAmount\(user\.withdrawPre, user\.currency\)/g, "formatAmount(user.withdrawPre, 'USDT')");
content = content.replace(/formatAmount\(200, user\.currency\)/g, "formatAmount(200, 'USDT')");
// wait, formatAmount(0, user.currency) is used in ds_sysSub. Let's fix sysSub explicitly
content = content.replace(/<span class="val text-red">\$\{dataMode === 'nodata' \? '-' : formatAmount\(0, user\.currency\)\}<\/span>/g, `<span class="val text-red">\${dataMode === 'nodata' ? '-' : formatAmount(0, 'USDT')}</span>`);

// But wait, user.deposit is also used in the main table! If the main table doesn't say USDT, what is it?
// The main table column for deposit says "存款总额" (Deposit Total). Doesn't have a currency unit in the header.
// So maybe `user.currency` is correct for the main table?
// Wait! If the user deposits USDT, then `user.deposit` is USDT? Yes. 

fs.writeFileSync('script.js', content);
