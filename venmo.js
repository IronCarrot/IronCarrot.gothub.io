// venmo.js
// Shared Venmo deeplink generator and utilities

function getVenmoDeeplink(recipient, amount, noteBase) {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const note = encodeURIComponent(`${noteBase} ${timestamp}`);
    return `venmo://paycharge?txn=pay&recipients=${recipient}&amount=${amount}&note=${note}`;
}

// Store only raw structured data (no link)
async function storeVenmoLink(data) {
    // data: { sum, num, recipient, note }
    localStorage.setItem('latestVenmoLink', JSON.stringify(data));
}

async function fetchLatestVenmoLink() {
    const raw = localStorage.getItem('latestVenmoLink');
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

async function showCurrentVenmoLink() {
    const data = await fetchLatestVenmoLink();
    const ref = document.getElementById('current-link-ref');
    if (ref) {
        if (data && data.recipient) {
            const amount = (parseFloat(data.sum) / parseInt(data.num)).toFixed(2);
                ref.innerHTML = `<a href="${getVenmoDeeplink(data.recipient, amount, data.note)}" target="_blank">${getVenmoDeeplink(data.recipient, amount, data.note)}</a><br>` +
                `<small>sum: ${data.sum}, num: ${data.num}, recipient: ${data.recipient}, note: ${data.note}</small>`;
        } else {
            ref.textContent = 'No link set yet.';
        }
    }
}

async function handleForm(e) {
    e.preventDefault();
    const sum = parseFloat(document.getElementById('sum-amount').value);
    const num = parseInt(document.getElementById('num-people').value);
    const recipient = document.getElementById('recipient').value.trim();
    const note = document.getElementById('note').value.trim();
    const data = { sum, num, recipient, note };
    const venmoLinkElem = document.getElementById('venmo-link');
        const amount = (sum / num).toFixed(2);
        venmoLinkElem.textContent = getVenmoDeeplink(recipient, amount, note);
        venmoLinkElem.href = getVenmoDeeplink(recipient, amount, note);
    document.getElementById('venmo-link-container').style.display = '';
    await storeVenmoLink(data); // Store only raw structured data
    alert('Venmo link generated and stored!');
}

