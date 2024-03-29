// createHTML.js

// Create an element and set its attributes
function createElement(tag, attributes, ...children) {
    const element = document.createElement(tag);
    for (const key in attributes) {
      element.setAttribute(key, attributes[key]);
      if (key === 'text') element.textContent = attributes[key]; // For text content
      if (key === 'html') element.innerHTML = attributes[key]; // For HTML content
    }
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  }
  
  // Generate the HTML structure
  function generateHtmlStructure() {
    const viewportMeta = createElement('meta', { name: 'viewport', content: 'width=device-width,initial-scale=1' });
    document.head.appendChild(viewportMeta);
  
    const drumMachineContainer = createElement('div', { class: 'drum-machine-container' },
      createElement('div', { id: 'drum-machine' },
        createElement('h1', {},
          createElement('span', { class: 'button-label', text: 'Play' }),
          createElement('div', { class: 'button-round' },
            createElement('div', { class: 'button play-button', id: 'play' })
          ),
          createElement('span', { class: 'button-label', text: 'Stop' }),
          createElement('div', { class: 'button-round' },
            createElement('div', { class: 'button stop-button', id: 'stop' })
          ),
          createElement('button', { id: 'new-load-button', style: 'display: none;', text: 'Load' }),
          createElement('div', { class: 'load-popup', id: 'loadOptions' },
            createElement('button', { id: 'loadJson', text: 'Load from Json file' })
          ),
          createElement('input', { id: 'load-file-input', type: 'file', accept: '.json' }),
          createElement('span', { class: 'button-label stop', style: 'display: none;', text: 'Stop' }),
          createElement('div', { class: 'button stop-button', id: 'stop' }),
          createElement('div', { class: 'tooltip bpm-container', style: 'display: none;' }, 'BPM: ',
            createElement('input', { id: 'bpm-slider', type: 'range', max: '180', min: '60', step: '1', title: 'Adjust the Beats Per Minute', value: '105' }),
            createElement('div', { class: 'bpm-display', id: 'bpm-display', text: '105' })
          ),
          createElement('span', { class: 'title', style: 'display: none;' }, 'Audional Sequencer<br>',
            createElement('span', { class: 'bright-orange', text: '₿' }),
            'itcoin',
            createElement('span', { class: 'bright-orange', text: '₿' }),
            'eats',
            createElement('span', { class: 'bright-orange small-text', text: '₿' }),
            createElement('span', { class: 'small-text', text: 'eta' })
          )
        )
      )
    );
  
    document.body.appendChild(drumMachineContainer);
  }
  
  // Call the function to generate the HTML structure
  generateHtmlStructure();
  