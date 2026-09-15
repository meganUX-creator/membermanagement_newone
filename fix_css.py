import re

with open('style.css', 'r') as f:
    content = f.read()

search = """/* 綁定銀行卡 (Input with inline label) */
.filter-row .form-group[data-filter-id="bankCard"] {
    min-width: 220px;
    max-width: 280px;
}"""

insert = """/* 綁定銀行卡 (Input with inline label) */
.filter-row .form-group[data-filter-id="bankCard"] {
    min-width: 220px;
    max-width: 280px;
}

/* 生日月份 (Dropdown) */
.filter-row .form-group[data-filter-id="birthday"] {
    min-width: 140px;
    max-width: 180px;
}

/* 登錄IP (Input with inline label) */
.filter-row .form-group[data-filter-id="loginIp"] {
    min-width: 160px;
    max-width: 220px;
}"""

content = content.replace(search, insert)

with open('style.css', 'w') as f:
    f.write(content)
