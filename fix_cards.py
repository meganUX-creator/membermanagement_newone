import re

with open('script.js', 'r') as f:
    content = f.read()

# Remove contact info (Column 3 and 4)
# It starts with: ${hasPerm(20) ? `
# And ends with: ` : ''}
# Since it's multi-line, I'll use regex.
pattern_contact = r'\s*\$\{hasPerm\(20\)\s*\?\s*`\s*<!-- Column 3 \(Contact Info Left\) -->.*?<!-- Column 4 \(Contact Info Right\) -->.*?`\s*:\s*\'\'\}'
content = re.sub(pattern_contact, '', content, flags=re.DOTALL)

# Also remove the border-right on Column 2
# old: <div style="min-width: max-content; margin-right: 16px; padding: 12px 16px; ${hasPerm(20) ? 'border-right: 1px solid #f1f5f9;' : ''}">
# new: <div style="min-width: max-content; margin-right: 16px; padding: 12px 16px;">
content = content.replace(
    """<div style="min-width: max-content; margin-right: 16px; padding: 12px 16px; ${hasPerm(20) ? 'border-right: 1px solid #f1f5f9;' : ''}">""",
    """<div style="min-width: max-content; margin-right: 16px; padding: 12px 16px;">"""
)

# Remove Card 5 (備註)
pattern_remark = r'\s*<!-- Card 5: 備註 -->.*?</div>\s*</div>\s*(?=</div>\s*</td>)'
content = re.sub(pattern_remark, '', content, flags=re.DOTALL)

with open('script.js', 'w') as f:
    f.write(content)

print("Cards removed and fixed.")
