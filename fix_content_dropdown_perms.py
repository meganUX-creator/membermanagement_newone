import re

with open('content.html', 'r') as f:
    content = f.read()

# Replace Contact Info logic
old_contact = """                // 下拉选单项目
                // Trace 14, 20 (邮箱, Zalo, WhatsApp, Telegram)
                const p14_dropdown = localStorage.getItem('perm-14') !== 'false';
                const p20 = localStorage.getItem('perm-20') !== 'false';
                const showContactInfo = p14_dropdown || p20;
                const contactInfoItems = ['email', 'zalo', 'whatsapp', 'telegram'];
                contactInfoItems.forEach(value => {
                    const el = document.querySelector(`#accountTypeMenu li[data-value="${value}"]`);
                    if (el) el.style.display = showContactInfo ? '' : 'none';
                });

                // Trace 36 (手机号)
                const showPhone = localStorage.getItem('perm-36') !== 'false';
                const phoneEl = document.querySelector(`#accountTypeMenu li[data-value="phone"]`);
                if (phoneEl) phoneEl.style.display = showPhone ? '' : 'none';"""

new_contact = """                // 下拉选单项目
                // Trace 20 (手机号, 邮箱, Zalo, WhatsApp, Telegram)
                const showContactInfo = localStorage.getItem('perm-20') !== 'false';
                const contactInfoItems = ['phone', 'email', 'zalo', 'whatsapp', 'telegram'];
                contactInfoItems.forEach(value => {
                    const el = document.querySelector(`#accountTypeMenu li[data-value="${value}"]`);
                    if (el) el.style.display = showContactInfo ? '' : 'none';
                });"""

content = content.replace(old_contact, new_contact)


# Replace Google Code logic
old_google = """                // Trace 31, 32 (谷歌验证码)
                const p31 = localStorage.getItem('perm-31') !== 'false';
                const p32 = localStorage.getItem('perm-32') !== 'false';
                const showGoogleCode = p31 || p32;
                const googleCodeEl = document.querySelector(`#accountTypeMenu li[data-value="googleCode"]`);
                if (googleCodeEl) googleCodeEl.style.display = showGoogleCode ? '' : 'none';"""

new_google = """                // Trace 31 (谷歌验证码)
                const showGoogleCode = localStorage.getItem('perm-31') !== 'false';
                const googleCodeEl = document.querySelector(`#accountTypeMenu li[data-value="googleCode"]`);
                if (googleCodeEl) googleCodeEl.style.display = showGoogleCode ? '' : 'none';"""

content = content.replace(old_google, new_google)

with open('content.html', 'w') as f:
    f.write(content)

print("Dropdown permissions updated successfully.")
