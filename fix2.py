import re

with open('/Users/user/Desktop/需求維護/usermanagement_new/0926_settings_new_lottery_4/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

def replacer(match):
    key = match.group(1)
    return f"(dataSourceFieldVisibility['{key}'] !== false && dataSourceFieldVisibility['{key}'] !== 'backup')"

# Replace `dataSourceFieldVisibility['X'] !== false`
pattern = r"dataSourceFieldVisibility\['([^']+)'\] !== false"

lines = content.split('\n')
for i in range(1960, 2110): # Only in the HTML template section
    lines[i] = re.sub(pattern, replacer, lines[i])

with open('/Users/user/Desktop/需求維護/usermanagement_new/0926_settings_new_lottery_4/script.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
