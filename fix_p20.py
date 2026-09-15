import re

with open('content.html', 'r') as f:
    content = f.read()

search = """                // Trace 20 (Contact Info Card toggle)
                const detailsContactInfoCard = document.getElementById('detailsContactInfoCard');"""
replace = """                // Trace 20 (Contact Info Card toggle)
                const p20 = localStorage.getItem('perm-20') !== 'false';
                const detailsContactInfoCard = document.getElementById('detailsContactInfoCard');"""

content = content.replace(search, replace)

with open('content.html', 'w') as f:
    f.write(content)
