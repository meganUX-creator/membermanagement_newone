import re

with open('/Users/user/Desktop/需求維護/usermanagement_new/0926_settings_new_lottery_4/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all occurrences of dataSourceFieldVisibility['XYZ'] !== false
# with (dataSourceFieldVisibility['XYZ'] !== false && dataSourceFieldVisibility['XYZ'] !== 'backup')
# in the generateTableRow function context

def replacer(match):
    key = match.group(1)
    return f"(dataSourceFieldVisibility[{key}] !== false && dataSourceFieldVisibility[{key}] !== 'backup')"

# We want to replace exactly this pattern
pattern = r"dataSourceFieldVisibility\[(.*?)\] !== false"

# Wait, we only want to do this for the HTML generation inside generateTableRow.
# Let's just do a global replace for all `!== false` in `script.js` related to `dataSourceFieldVisibility`
# except where it might be unsafe.

lines = content.split('\n')
for i, line in enumerate(lines):
    # Only replace if it is checking visibility
    if "dataSourceFieldVisibility[" in line and "!== false" in line and "isCol1" not in line and "const nowVisible" not in line and "drawerCategoryVisibility" not in line:
        if "generateTableRow" in content[:sum(len(l)+1 for l in lines[:i])] or "renderWalletRow" in line:
            lines[i] = re.sub(pattern, replacer, line)
            
    # wait, there's also avatar logic
    if "dataSourceFieldVisibility['ds_avatar'] !== false" in line:
        lines[i] = line.replace("dataSourceFieldVisibility['ds_avatar'] !== false", "(dataSourceFieldVisibility['ds_avatar'] !== false && dataSourceFieldVisibility['ds_avatar'] !== 'backup')")

with open('/Users/user/Desktop/需求維護/usermanagement_new/0926_settings_new_lottery_4/script.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
