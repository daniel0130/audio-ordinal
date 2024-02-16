const baseApiUrl = 'https://api.sordinals.com/api/v1';

async function fetchData(url, sectionId, title) {
    console.log(`Fetching data from URL: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok for ${url}`);
        const data = await response.json();
        console.log(`Data received for ${title}:`, data);
        displayData(sectionId, title, data);
        if (sectionId === 'inscriptionDetails' && data.inscriptionHash) {
            console.log(`Found inscriptionHash for fetching children: ${data.inscriptionHash}`);
            await fetchAndDisplayChildCount(data.inscriptionHash);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        displayData(sectionId, title, { error: error.message });
    }
}

function adjustIframeSize(iframe) {
    iframe.style.height = `${iframe.clientWidth}px`;
}

async function displayData(sectionId, title, data, isParent = true) {
    console.log(`Displaying data for ${title}`);
    const section = document.getElementById(sectionId);
    section.innerHTML = data ? `<h2>${title}</h2><pre>${JSON.stringify(data, null, 2)}</pre>` : `<h2>${title}</h2><p>No data available</p>`;

    if (isParent) {
        const iframe = document.getElementById('inscriptionContentIframe');
        if (data && data.fileUrl) {
            iframe.style.display = 'block';
            let contentToLoad = data.contentType && data.contentType.startsWith('image/') ?
                createImageContent(data.fileUrl) : data.fileUrl;
            loadIframeContent(iframe, contentToLoad);
        } else {
            iframe.style.display = 'none';
        }
    }
}

function createImageContent(fileUrl) {
    const imageHTML = `<html><head><style>body,html{margin:0;padding:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;background-color:#f0f0f0;}img{width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src="${fileUrl}" alt="Inscription Image"></body></html>`;
    const blob = new Blob([imageHTML], { type: 'text/html' });
    return URL.createObjectURL(blob);
}

function loadIframeContent(iframe, content) {
    iframe.src = content;
    iframe.onload = () => {
        if (content !== iframe.src) URL.revokeObjectURL(content); // Revoke only if content is a blob URL
        adjustIframeSize(iframe);
    };
    iframe.onerror = () => {
        console.error(`Error loading content in iframe from: ${iframe.src}`);
        if (content !== iframe.src) URL.revokeObjectURL(content);
    };
}

async function fetchAndDisplayChildCount(parentInscriptionHash) {
    const url = `${baseApiUrl}/inscriptions/parent/${parentInscriptionHash}?order=asc&page=1&limit=1`;
    console.log(`Fetching children count and details for inscriptionHash: ${parentInscriptionHash}`);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok for ${url}`);
        const childData = await response.json();

        if (childData.count > 0 && childData.data.length > 0) {
            document.getElementById('childCount').innerHTML = `PARENT INSCRIPTION - Number of Children: ${childData.count}`;
            const firstChildDetailsUrl = `${baseApiUrl}/inscriptions/${childData.data[0].id || childData.data[0].inscriptionHash}`;
            displayFirstChildDetails(firstChildDetailsUrl);
        } else {
            document.getElementById('childCount').style.display = 'none';
            document.getElementById('childDetails').innerHTML = 'No children found.';
        }
    } catch (error) {
        console.error('Error fetching child inscriptions:', error);
        document.getElementById('childCount').innerHTML = 'Error fetching children count.';
        document.getElementById('childDetails').innerHTML = `Error: ${error.message}`;
    }
}

async function displayFirstChildDetails(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok for fetching child details: ${url}`);
        const childDetailsData = await response.json();
        console.log(`First child details data received:`, childDetailsData);
        displayData('childDetails', 'First Child Details', childDetailsData, false);
    } catch (error) {
        console.error('Error fetching first child details:', error);
    }
}

function getDetails(type, inputValue = null) {
    console.log(`Getting details for type: ${type}, inputValue: ${inputValue}`);
    const inputMap = {
        number: 'inscriptionNumberInput',
        hash: 'inscriptionHashInput',
        owner: 'ownerAddressInput',
        parent: 'parentIDInput',
    };
    const apiUrlPartMap = {
        number: 'inscriptions',
        hash: 'inscriptions/hash',
        owner: 'inscriptions/owner',
        parent: 'inscriptions/parent',
    };
    const sectionIdMap = {
        owner: 'ownedInscriptions',
        default: 'inscriptionDetails',
    };
    const titleMap = {
        number: 'Inscription Details',
        hash: 'Inscription Details by Hash',
        owner: 'Owned Inscriptions',
        parent: 'Child Inscriptions of Parent ID',
    };

    inputValue = inputValue || document.getElementById(inputMap[type]).value;
    const sectionId = sectionIdMap[type] || sectionIdMap.default;
    const title = titleMap[type];
    const url = `${baseApiUrl}/${apiUrlPartMap[type]}/${inputValue}`;
    if (inputValue) fetchData(url, sectionId, title);
}

function handleKeypress(e, type) {
    if (e.key === 'Enter') {
        e.preventDefault();
        getDetails(type);
    }
}
