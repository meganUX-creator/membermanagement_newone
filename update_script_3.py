import re

with open('/Users/user/Desktop/需求維護/usermanagement_new/0926_settings_new_lottery_4/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove window.demoteColumnToBackup
content = re.sub(r"window\.demoteColumnToBackup = function \([^)]*\) \{[\s\S]*?renderDrawerStates\(\);\s*};", "", content)

# Remove createCol3Item
content = re.sub(r"function createCol3Item\(col\) \{[\s\S]*?return div;\s*\}", "", content)

with open('/Users/user/Desktop/需求維護/usermanagement_new/0926_settings_new_lottery_4/script.js', 'w', encoding='utf-8') as f:
    f.write(content)
