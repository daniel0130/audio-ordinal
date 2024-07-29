function generateIndividualReceipt() {
    const ordinalElementId = document.getElementById('ordinalElementId').value;
    if (!ordinalElementId) {
        alert('Ordinal Element ID is required to generate an individual receipt.');
        return;
    }
    if (!isValidOrdinalId(ordinalElementId)) {
        alert('Ordinal Element ID is not valid.');
        return;
    }

    const fields = ['songName', 'songUrl', 'totalEarned', 'marketplaceCut', 'totalReceived', 'numRecipients', 'totalRoyalties', 'royaltySplit', 'collectionArtworkUrl', 'receiptBackgroundUrl'];
    const receiptData = fields.reduce((data, field) => {
        const value = document.getElementById(field).value;
        if (field.includes('Url') && !isValidOrdinalId(value)) {
            alert(`${field.replace(/([A-Z])/g, ' $1')} is not a valid URL.`);
            return data;
        }
        data[field] = value;
        return data;
    }, {});
    receiptData.ordinalElementId = ordinalElementId;

    const receiptContent = `
        <h2>Audional Royalty Payment</h2>
        ${Object.keys(receiptData).map(key => {
            if (key === 'ordinalElementId' || key === 'songUrl') {
                return `<p><strong>${key.replace(/([A-Z])/g, ' $1')}:</strong> <a href="https://ordinals.com/content/${receiptData[key]}" target="_blank">${receiptData[key]}</a></p>`;
            }
            if (key !== 'collectionArtworkUrl' && key !== 'receiptBackgroundUrl') {
                return `<p><strong>${key.replace(/([A-Z])/g, ' $1')}:</strong> ${receiptData[key]}</p>`;
            }
            return '';
        }).join('')}
        <div style="margin-top: 10px; padding: 5px; border: 2px solid red; text-align: center;">
            <strong>***IMPORTANT - PLEASE READ***</strong>
            <p>
                This ordinal inscription facilitates automated and decentralized royalty payments between artists, sample holders, and plug-in creators. Payments are embedded in the padding of royalty receipts, using ordinal IDs, without needing payment addresses.
                If you are the original receiver of this royalty receipt, it may contain royalty payments.
            </p>
        </div>
    `;

    document.getElementById('receipt-content').innerHTML = receiptContent;

    const collectionArtworkUrl = `https://ordinals.com/content/${receiptData.collectionArtworkUrl}`;
    if (collectionArtworkUrl && collectionArtworkUrl.endsWith('.html')) {
        document.getElementById('collectionArtworkIframe').src = collectionArtworkUrl;
        document.getElementById('collectionArtworkIframe').style.display = 'block';
        document.getElementById('collectionArtwork').style.display = 'none';
    } else {
        document.getElementById('collectionArtwork').src = collectionArtworkUrl;
        document.getElementById('collectionArtwork').style.display = 'block';
        document.getElementById('collectionArtworkIframe').style.display = 'none';
    }

    const receiptBackgroundUrl = `https://ordinals.com/content/${receiptData.receiptBackgroundUrl}`;
    if (receiptBackgroundUrl) {
        const receipt = document.getElementById('receipt');
        receipt.style.setProperty('--bg-url', `url(${receiptBackgroundUrl})`);
        receipt.style.display = 'block';
    }
}

function checkOrdinalElementId() {
    const ordinalElementId = document.getElementById('ordinalElementId').value;
    const button = document.getElementById('generateIndividualReceipt');
    const isValid = isValidOrdinalId(ordinalElementId);
    button.disabled = !isValid;
    button.style.backgroundColor = isValid ? 'green' : 'red';
    button.style.cursor = isValid ? 'pointer' : 'not-allowed';
    button.setAttribute('enabled', isValid ? 'true' : 'false');
}

window.onload = function() {
    calculate();
    setupUrlListeners();
    checkOrdinalElementId();
};
