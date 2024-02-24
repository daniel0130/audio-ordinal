// IframeSelectionManager.js
export class IframeSelectionManager {
    constructor() {
        this.selectedPads = new Set();
    }

    // Toggle the selection state of a pad
    togglePadSelection(padId) {
        if (this.selectedPads.has(padId)) {
            this.selectedPads.delete(padId);
            this.updatePadVisual(padId, false);
        } else {
            this.selectedPads.add(padId);
            this.updatePadVisual(padId, true);
        }
    }

    // Update the visual state of a pad
    updatePadVisual(padId, isSelected) {
        const padElement = document.getElementById(padId);
        if (padElement) {
            padElement.classList.toggle('selected-pad', isSelected);
        }
    }

    // Select multiple pads
    selectMultiplePads(padIds) {
        padIds.forEach(padId => {
            this.selectedPads.add(padId);
            this.updatePadVisual(padId, true);
        });
    }

    // Deselect all pads
    deselectAllPads() {
        this.selectedPads.forEach(padId => {
            this.updatePadVisual(padId, false);
        });
        this.selectedPads.clear();
    }
}
