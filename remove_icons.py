import re

with open('script.js', 'r') as f:
    content = f.read()

# Remove the icons: <i class="ph ph-..." style="position: absolute; left: 8px; font-size: 16px;"></i>
content = re.sub(r'<i class="ph ph-[a-z\-]+" style="position: absolute; left: 8px; font-size: 16px;"></i>\s*', '', content)

# Adjust padding: 4px 8px 4px 30px; -> padding: 4px 8px 4px 10px;
content = content.replace('padding: 4px 8px 4px 30px;', 'padding: 4px 8px 4px 10px;')

with open('script.js', 'w') as f:
    f.write(content)

print("Icons removed and padding adjusted.")
