import re

with open('script.js', 'r') as f:
    content = f.read()

# Replace ${col.label} with ${typeof col.label === 'function' ? '新增時間/最後登入' : col.label}
# only for the places inside the custom column settings modal (lines 3000, 3067)
content = content.replace(
    '${checkboxHtml} <span style="${labelSpanStyle}">${col.label}</span>',
    '${checkboxHtml} <span style="${labelSpanStyle}">${typeof col.label === \'function\' ? \'新增時間 / 最後登入\' : col.label}</span>'
)

# And line 2208: nestedHeaderHtml += `<th>${col.label}</th>`;
content = content.replace(
    'nestedHeaderHtml += `<th>${col.label}</th>`;',
    'nestedHeaderHtml += `<th>${typeof col.label === \'function\' ? \'新增時間 / 最後登入\' : col.label}</th>`;'
)

with open('script.js', 'w') as f:
    f.write(content)

print("Labels fixed!")
