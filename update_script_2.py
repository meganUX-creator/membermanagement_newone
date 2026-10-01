import re

with open('/Users/user/Desktop/需求維護/usermanagement_new/0926_settings_new_lottery_4/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove backup checks from HTML generation
content = re.sub(r"\s*&&\s*dataSourceFieldVisibility\['[^']+'\] !== 'backup'", "", content)

# Remove `const backupFields = [];` entirely
content = content.replace("const backupFields = [];", "")

# Remove any other function that sets to 'backup', e.g., window.removeCardColumn
content = re.sub(r"window\.removeCardColumn = function \([^)]*\) \{[^}]*dataSourceFieldVisibility[^}]*\};", "", content, flags=re.MULTILINE)

# Just fully search for "backup" and replace it if it's setting dataSourceFieldVisibility
content = re.sub(r"dataSourceFieldVisibility\[id\] = 'backup';", "dataSourceFieldVisibility[id] = false;", content)

# Also remove `window.promoteColumnFromBackup` and `window.addBackupToCard`
content = re.sub(r"window\.promoteColumnFromBackup = function \([^)]*\) \{[\s\S]*?updateTableFromDrawer\(\);\s*};", "", content)
content = re.sub(r"window\.addBackupToCard = function \([^)]*\) \{[\s\S]*?renderDrawerStates\(\);\s*};", "", content)

with open('/Users/user/Desktop/需求維護/usermanagement_new/0926_settings_new_lottery_4/script.js', 'w', encoding='utf-8') as f:
    f.write(content)
