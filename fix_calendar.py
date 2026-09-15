import re

with open('style.css', 'r') as f:
    content = f.read()

# Remove the display: none rule for the calendar picker indicator
rule = """input[type="date"]::-webkit-calendar-picker-indicator,
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}"""
content = content.replace(rule, "/* Native calendar indicator restored for file:// iframe compatibility */")

with open('style.css', 'w') as f:
    f.write(content)

with open('script.js', 'r') as f:
    script_content = f.read()

# Remove the showPicker event listener
picker_rule = """document.querySelectorAll('input[type="datetime-local"], input[type="date"]').forEach(input => {
    input.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof input.showPicker === 'function') {
            try {
                input.showPicker();
            } catch (err) {
                console.error("showPicker error: ", err);
            }
        }
    });
});"""
script_content = script_content.replace(picker_rule, "")

with open('script.js', 'w') as f:
    f.write(script_content)

with open('content.html', 'r') as f:
    html_content = f.read()

# Remove onclick from date-range-compact
html_content = html_content.replace('onclick="if(event.target.tagName!==\'INPUT\'){const inp=this.querySelector(\'input\'); if(inp && inp.showPicker) inp.showPicker();}"', '')

with open('content.html', 'w') as f:
    f.write(html_content)
