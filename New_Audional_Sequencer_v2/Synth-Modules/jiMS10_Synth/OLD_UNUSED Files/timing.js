// timing.js

let previousTimestamp = null;
        let sequencerBPM = null;

       // Adjust the onSequencerStep function to dynamically adjust the note placement
        function onSequencerStep(currentStep) {
            const currentTimestamp = Date.now();

            if (previousTimestamp !== null) {
                const delta = currentTimestamp - previousTimestamp; // time difference in milliseconds
                const currentBPM = (60000 / delta) / 4; // Convert to BPM considering 16th notes

                // Add the current BPM to the buffer and remove the oldest one if necessary
                bpmBuffer.push(currentBPM);
                if (bpmBuffer.length > bpmBufferSize) {
                    bpmBuffer.shift();
                }

                // Compute the average BPM from the buffer
                const averageBPM = bpmBuffer.reduce((sum, bpm) => sum + bpm, 0) / bpmBuffer.length;

                // Only adjust the arpeggiator's timing if the checkbox is checked
                if (document.getElementById("useSequencerTiming").checked) {
                    adjustArpeggiatorTiming(averageBPM);
                }
            }

            // If the current time is very close to the expected next step time, reset the arp note index
            if (Math.abs(Date.now() - expectedNextStepTime) < 10) { // Assuming a 10ms tolerance
                currentArpIndex = 0;
            }

            previousTimestamp = currentTimestamp;
        }


        function adjustArpeggiatorTiming(bpm) {
            if (isNudgeActive) {
                let timingAdjustValue = parseFloat(document.getElementById("timingAdjust").value) / 100;
                const adjustmentMultiplier = 1 + timingAdjustValue;
                bpm *= adjustmentMultiplier;
            }

            const bpmAdjustValue = parseFloat(document.getElementById("bpmAdjustValue").value);
            bpm += bpmAdjustValue; // Use the user-adjusted value

            // Adjust the arpeggiator's BPM to match the sequencer's BPM
            document.getElementById("arpTempo").value = bpm.toFixed(1);

            // Calculate when the next step is expected
            const stepInterval = (60000 / bpm) / 4; // Considering 16th notes
            expectedNextStepTime = Date.now() + stepInterval;
        }




        


        const bpmBuffer = [];
        const bpmBufferSize = 100; // Change this to whatever size you think is appropriate. The larger the value, the smoother the adjustments.

        // Adjust the onSequencerStep function to only adjust the arpeggiator's timing if the checkbox is checked
        function onSequencerStep(currentStep) {
            const currentTimestamp = Date.now();

            if (previousTimestamp !== null) {
                const delta = currentTimestamp - previousTimestamp; // time difference in milliseconds
                const currentBPM = (60000 / delta) / 4; // Convert to BPM considering 16th notes

                // Add the current BPM to the buffer and remove the oldest one if necessary
                bpmBuffer.push(currentBPM);
                if (bpmBuffer.length > bpmBufferSize) {
                    bpmBuffer.shift();
                }

                // Compute the average BPM from the buffer
                const averageBPM = bpmBuffer.reduce((sum, bpm) => sum + bpm, 0) / bpmBuffer.length;

                // Only adjust the arpeggiator's timing if the checkbox is checked
                if (document.getElementById("useSequencerTiming").checked) {
                    adjustArpeggiatorTiming(averageBPM);
                }
            }

            previousTimestamp = currentTimestamp;
        }