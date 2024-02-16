const fetch = require('node-fetch'); // If using Node.js, otherwise just use fetch in browsers

const baseApiUrl = 'https://api.sordinals.com/api/v1';
const inscriptionId = 'f9cfa12f7f290d0d589c5a52525b0d8ac3b941a01e7e1afc101c9cdd47680177';
const inscriptionNumber = '211266';

// Function to fetch inscription details by number
async function fetchInscriptionDetails() {
    const url = `${baseApiUrl}/inscriptions/${inscriptionNumber}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log('Inscription Details:', data);
}

// Function to fetch inscription details by hash
async function fetchInscriptionDetailsByHash() {
    const url = `${baseApiUrl}/inscriptions/hash/${inscriptionId}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log('Inscription Details by Hash:', data);
}

// Assuming we don't know the owner's address or parent inscription ID in this example
// Replace `yourAddress` and `parentInscriptionId` with actual values if known
const yourAddress = 'replace_with_actual_address';
const parentInscriptionId = 'replace_with_parent_inscription_id_if_known';

// Function to fetch inscriptions owned by a specific address
async function fetchOwnedInscriptions() {
    const url = `${baseApiUrl}/inscriptions/owner/${yourAddress}?order=asc&page=1&limit=10`;
    const response = await fetch(url);
    const data = await response.json();
    console.log('Owned Inscriptions:', data);
}

// Function to fetch child inscriptions of a specified parent inscription
async function fetchChildInscriptions() {
    const url = `${baseApiUrl}/inscriptions/parent/${parentInscriptionId}?order=asc&page=1&limit=10`;
    const response = await fetch(url);
    const data = await response.json();
    console.log('Child Inscriptions:', data);
}

// Execute functions to fetch all possible information about the inscription
async function executeFetches() {
    await fetchInscriptionDetails();
    await fetchInscriptionDetailsByHash();

    // Uncomment these if you have the owner's address and parent inscription ID
    // await fetchOwnedInscriptions();
    // await fetchChildInscriptions();
}

executeFetches();
