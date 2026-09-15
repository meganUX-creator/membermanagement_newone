import re

with open('script.js', 'r') as f:
    content = f.read()

# Fix offlineDays label
content = content.replace('未登入天数 > ${inputOfflineDays.value.trim()}', '未登入天数: ${inputOfflineDays.value.trim()}')
content = content.replace('未登入天数 > ${inputOfflineDaysOuter.value.trim()}', '未登入天数: ${inputOfflineDaysOuter.value.trim()}')

# Remove the duplicate birthdayOuter push that I added earlier
duplicate_birthday_block = """        // 2.5 Birthday Outer
        if (selectedBirthdayOuterVal) {
            const dropdownBirthdayOuter = document.getElementById('dropdownBirthdayOuter');
            if (dropdownBirthdayOuter) {
                tags.push({ key: 'birthdayOuter', label: `生日月份: ${selectedBirthdayOuterVal}`, type: 'single-custom', element: dropdownBirthdayOuter, defaultValue: '', defaultText: '请选择生日月份', valueVarSetter: (v) => selectedBirthdayOuterVal = v });
            }
        }"""
content = content.replace(duplicate_birthday_block, "")

# Fix the remaining birthdayOuter push to not append "月"
content = content.replace("`生日: ${selectedBirthdayOuterVal}月`", "`生日: ${selectedBirthdayOuterVal}`")
content = content.replace("defaultText: '全部'", "defaultText: '请选择生日月份'") # For the birthday dropdown

with open('script.js', 'w') as f:
    f.write(content)
