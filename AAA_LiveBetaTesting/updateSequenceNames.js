// updateSequenceNames.js

function updateSequenceNamesInHTML(sequenceNames) {
    const sequenceNamesElement = document.getElementById('sequence-names');
    
    // Clear the current list of sequence names
    sequenceNamesElement.innerHTML = '';

    // Add each sequence name as a list item
    sequenceNames.forEach(name => {
        const listItem = document.createElement('li');
        listItem.textContent = name;
        sequenceNamesElement.appendChild(listItem);
    });
}
