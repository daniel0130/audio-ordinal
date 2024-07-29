 // Utility function for validation
 function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function isValidOrdinalId(id) {
    const regex = /^[0-9a-fA-F]{64}(i\d+)?$/;
    return regex.test(id);
}

function extractIdFromUrl(url) {
    return url.split('/').pop();
}

function setupUrlListeners() {
    const urlFields = ['songUrl', 'ordinalElementId', 'collectionArtworkUrl', 'receiptBackgroundUrl'];
    urlFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', function() {
            if (isValidUrl(this.value)) {
                this.value = extractIdFromUrl(this.value);
            }
            if (fieldId === 'ordinalElementId') {
                checkOrdinalElementId();
            }
        });
    });
}

function calculate() {
    const totalCollectionSize = parseInt(document.getElementById('totalCollectionSize').value) || 0;
    const pricePerItem = parseFloat(document.getElementById('pricePerItem').value) || 0;
    const totalItemsSold = parseInt(document.getElementById('totalItemsSold').value) || 0;
    const totalEarned = totalItemsSold * pricePerItem;
    const marketplaceCut = parseFloat(document.getElementById('marketplaceCut').value) || 0;
    const totalReceived = totalEarned - (totalEarned * marketplaceCut / 100);
    const numRecipients = parseInt(document.getElementById('numRecipients').value) || 0;
    const totalRoyalties = totalReceived * 0.2;
    const royaltySplit = numRecipients > 0 ? totalRoyalties / numRecipients : 0;

    document.getElementById('totalEarned').value = totalEarned.toFixed(8);
    document.getElementById('totalReceived').value = totalReceived.toFixed(8);
    document.getElementById('totalRoyalties').value = totalRoyalties.toFixed(8);
    document.getElementById('royaltySplit').value = royaltySplit.toFixed(8);
}

function generateDataFile() {
    const fields = [
        { name: 'songName', abbr: 'sN' },
        { name: 'songUrl', abbr: 'sU' },
        { name: 'totalCollectionSize', abbr: 'tCS' },
        { name: 'pricePerItem', abbr: 'pPI' },
        { name: 'marketplaceCut', abbr: 'mC' },
        { name: 'totalReceived', abbr: 'tR' },
        { name: 'numRecipients', abbr: 'nR' },
        { name: 'totalRoyalties', abbr: 'tRY' },
        { name: 'royaltySplit', abbr: 'rS' },
        { name: 'collectionArtworkUrl', abbr: 'cAU' },
        { name: 'receiptBackgroundUrl', abbr: 'rBU' },
        { name: 'ordinalElementId', abbr: 'oEI' }
    ];

    const receiptData = fields.reduce((data, field) => {
        const value = document.getElementById(field.name).value;
        if (field.name.includes('Url') && !isValidOrdinalId(value)) {
            alert(`${field.name.replace(/([A-Z])/g, ' $1')} is not a valid URL.`);
            return data;
        }
        if (field.name === 'ordinalElementId' && !isValidOrdinalId(value)) {
            alert('Ordinal Element ID is not valid.');
            return data;
        }
        data[field.abbr] = value;
        return data;
    }, {});

    const serializedData = fields.map(field => receiptData[field.abbr]).join(',');
    const blob = new Blob([serializedData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'receiptData.csv';
    link.click();
}

function loadDataFile() {
    const fields = [
        { name: 'songName', abbr: 'sN' },
        { name: 'songUrl', abbr: 'sU' },
        { name: 'totalCollectionSize', abbr: 'tCS' },
        { name: 'pricePerItem', abbr: 'pPI' },
        { name: 'marketplaceCut', abbr: 'mC' },
        { name: 'totalReceived', abbr: 'tR' },
        { name: 'numRecipients', abbr: 'nR' },
        { name: 'totalRoyalties', abbr: 'tRY' },
        { name: 'royaltySplit', abbr: 'rS' },
        { name: 'collectionArtworkUrl', abbr: 'cAU' },
        { name: 'receiptBackgroundUrl', abbr: 'rBU' },
        { name: 'ordinalElementId', abbr: 'oEI' }
    ];

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'text/csv';
    input.onchange = event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const serializedData = reader.result;
            const values = serializedData.split(',');
            const receiptData = fields.reduce((data, field, index) => {
                data[field.name] = values[index];
                return data;
            }, {});

            for (const key in receiptData) {
                if (receiptData.hasOwnProperty(key)) {
                    document.getElementById(key).value = receiptData[key];
                }
            }
            checkOrdinalElementId();
            calculate();
        };
        reader.readAsText(file);
    };
    input.click();
}