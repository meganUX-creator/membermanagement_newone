import re

with open('script.js', 'r') as f:
    content = f.read()

search = """        // 2. Level
        if (selectedLevelVal) {
            tags.push({ key: 'level', label: `层级: ${selectedLevelVal}`, type: 'single-custom', element: dropdownLevel, defaultValue: '', defaultText: '全部', valueVarSetter: (v) => selectedLevelVal = v });
        }"""

insert = """        // 2. Level
        if (selectedLevelVal) {
            tags.push({ key: 'level', label: `层级: ${selectedLevelVal}`, type: 'single-custom', element: dropdownLevel, defaultValue: '', defaultText: '全部', valueVarSetter: (v) => selectedLevelVal = v });
        }
        // 2.5 Birthday Outer
        if (selectedBirthdayOuterVal) {
            const dropdownBirthdayOuter = document.getElementById('dropdownBirthdayOuter');
            if (dropdownBirthdayOuter) {
                tags.push({ key: 'birthdayOuter', label: `生日月份: ${selectedBirthdayOuterVal}`, type: 'single-custom', element: dropdownBirthdayOuter, defaultValue: '', defaultText: '请选择生日月份', valueVarSetter: (v) => selectedBirthdayOuterVal = v });
            }
        }"""

content = content.replace(search, insert)

# Now add login IP
search2 = """        if (inputBankCard.value.trim()) {
            tags.push({ key: 'bankCard', label: `银行卡末码: *${inputBankCard.value.trim()}`, type: 'input', element: inputBankCard });
            advancedCount++;
        }"""

insert2 = """        if (inputBankCard.value.trim()) {
            tags.push({ key: 'bankCard', label: `银行卡末码: *${inputBankCard.value.trim()}`, type: 'input', element: inputBankCard });
            advancedCount++;
        }
        const inputLoginIpOuter = document.getElementById('inputLoginIpOuter');
        if (inputLoginIpOuter && inputLoginIpOuter.value.trim()) {
            tags.push({ key: 'loginIpOuter', label: `登录IP: ${inputLoginIpOuter.value.trim()}`, type: 'input', element: inputLoginIpOuter });
        }"""

content = content.replace(search2, insert2)

with open('script.js', 'w') as f:
    f.write(content)
