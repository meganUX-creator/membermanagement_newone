import re

with open('content.html', 'r') as f:
    content = f.read()

# Let's insert a console.log at the very beginning of updatePermissions()
search = "function updatePermissions() {"
insert = "function updatePermissions() {\n                console.log('updatePermissions called!');"
content = content.replace(search, insert)

# Let's also log the showContactInfo value
search2 = "const contactInfoItems = ['phone', 'email', 'zalo', 'whatsapp', 'telegram'];"
insert2 = "const contactInfoItems = ['phone', 'email', 'zalo', 'whatsapp', 'telegram'];\n                console.log('showContactInfo:', showContactInfo, 'showGoogleCode:', showGoogleCode);"
# Wait, showGoogleCode is defined AFTER this.
content = content.replace(search2, insert2)

with open('content.html', 'w') as f:
    f.write(content)
