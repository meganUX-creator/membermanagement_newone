import re

with open('script.js', 'r') as f:
    content = f.read()

# Replace width: 250px with min-width: max-content inside Card 1
start_marker = "<!-- Card 1: 基本資料 -->"
end_marker = "<!-- Card 2: 設備與ip -->"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit(1)

card1_content = content[start_idx:end_idx]
card1_content = card1_content.replace('width: 250px;', 'min-width: max-content; margin-right: 16px;')

final_content = content[:start_idx] + card1_content + content[end_idx:]

with open('script.js', 'w') as f:
    f.write(final_content)

print("Fixed width!")
