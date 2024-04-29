const synth = new Tone.Synth().toDestination();

    function playNote(note) {
        synth.triggerAttackRelease(note, "8n");
    }

  
    const filter = new Tone.Filter(1000, "lowpass").toDestination();
     synth.connect(filter);

    function changeFilterFrequency(value) {
     filter.frequency.value = value;
    }


