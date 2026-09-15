import re

with open('content.html', 'r') as f:
    content = f.read()

# We need to insert the reset logic right before the end of updatePermissions()
# We can find `editFormPayLevel.style.opacity = '';` and `}` and `}`
search_str = """                        editFormPayLevel.style.opacity = '';
                    }
                }"""

insert_str = """                        editFormPayLevel.style.opacity = '';
                    }
                }
                
                // If the currently active dropdown option is hidden, reset to 'exact'
                const activeAccountType = document.querySelector('#accountTypeMenu li.active');
                if (activeAccountType && activeAccountType.style.display === 'none') {
                    const exactItem = document.querySelector('#accountTypeMenu li[data-value="exact"]');
                    if (exactItem) exactItem.click();
                }"""

content = content.replace(search_str, insert_str)

with open('content.html', 'w') as f:
    f.write(content)

print("Added reset logic to updatePermissions()")
