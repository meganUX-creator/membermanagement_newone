import re

with open('style.css', 'r') as f:
    content = f.read()

rule = """.filter-row .form-group[data-filter-id="registerTime"] {
    min-width: 320px;
    max-width: 380px;
}"""

new_rule = """.filter-row .form-group[data-filter-id="registerTime"] {
    min-width: 440px;
    max-width: 500px;
}"""

content = content.replace(rule, new_rule)

with open('style.css', 'w') as f:
    f.write(content)
