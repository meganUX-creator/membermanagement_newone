import re

with open('script.js', 'r') as f:
    content = f.read()

# Define colName inside both nested and compact loops in renderDropdown()
col_name_def = """
                const customNames = {
                    'dateInfo': '新增時間 / 登入 / 離開天數',
                    'yebInfo': '餘額寶 / 利息',
                    'depositInfo': '存款總額 / 次數',
                    'withdrawInfo': '取款總額 / 次數 / 扣款',
                    'adminFundInfo': '後台加扣款'
                };
                const colName = customNames[col.id] || col.label;
"""

# Inside nested cols loop
content = re.sub(r'permCols\.forEach\(col => \{', 'permCols.forEach(col => {' + col_name_def, content)

# Inside compact cols loop
content = re.sub(r'compactColumnsConfig\.forEach\(col => \{', 'compactColumnsConfig.forEach(col => {' + col_name_def, content)

with open('script.js', 'w') as f:
    f.write(content)

print("colName defined successfully!")
