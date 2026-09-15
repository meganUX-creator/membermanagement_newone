import re

with open('script.js', 'r') as f:
    content = f.read()

start_marker = "    let compactColumnsConfig = [\n"
start_idx = content.find(start_marker)
if start_idx == -1:
    print("Could not find array start.")
    exit(1)
start_idx += len(start_marker)

end_idx = content.find("    ];", start_idx)

if end_idx == -1:
    print("Could not find array end.")
    exit(1)

array_content = content[start_idx:end_idx]

# Split the string by "{ id: '"
# Sometimes it's `{ id: '` or `{id: '` but the file uses `{ id: '`
items_raw = re.split(r"(?m)^\s*\{ id: '", array_content)

items = {}
for item in items_raw[1:]:
    id_str = item.split("'", 1)[0]
    full_str = "        { id: '" + item
    full_str = full_str.rstrip()
    if full_str.endswith(','):
        full_str = full_str[:-1]
    items[id_str] = full_str

desired_order_start = ['uid', 'account', 'online', 'status', 'avatar', 'realName', 'nickname']
desired_order_middle = [
    'vipLevel',
    'availableCredit',
    'thirdBal',
    'depositInfo',
    'withdrawInfo',
    'dateInfo',
    'creditValue',
    'arrears',
    'growthInfo',
    'points',
    'commissionBal',
    'yebInfo',
    'adminFundInfo'
]
desired_order_end = ['action']

all_ids = list(items.keys())
used_ids = set(desired_order_start + desired_order_middle + desired_order_end)
remaining_ids = [cid for cid in all_ids if cid not in used_ids]

final_order = desired_order_start + desired_order_middle + remaining_ids + desired_order_end

new_array_content = ",\n".join([items[cid] for cid in final_order if cid in items]) + "\n"

new_content = content[:start_idx] + new_array_content + content[end_idx:]

with open('script.js', 'w') as f:
    f.write(new_content)

print("Reordered successfully.")
