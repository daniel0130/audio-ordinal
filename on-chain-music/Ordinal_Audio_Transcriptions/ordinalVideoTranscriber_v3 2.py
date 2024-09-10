import whisperx
import requests
from io import BytesIO
import tempfile
import pandas as pd
import os
import time
import threading

BASE_URL = "https://ordinals.com/content/"

# Log status every 10-15 seconds in a separate thread
class ProgressLogger:
    def __init__(self):
        self.current_task = "Starting..."
        self._stop_flag = False

    def log_progress(self):
        while not self._stop_flag:
            print(f"Status: {self.current_task}")
            time.sleep(10)  # Log every 10 seconds

    def start_logging(self):
        self.thread = threading.Thread(target=self.log_progress)
        self.thread.start()

    def stop_logging(self):
        self._stop_flag = True
        self.thread.join()

progress_logger = ProgressLogger()

def transcribe_words(ordinal_id):
    try:
        device = "cpu"
        compute_type = "int8"
        batch_size = 16

        # Construct the audio URL from the ordinal ID
        audio_url = f"{BASE_URL}{ordinal_id}"

        # Set up headers to mimic a browser request
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36"
        }

        progress_logger.current_task = f"Fetching audio for {ordinal_id}"
        
        # Fetch the audio file from the URL with a timeout
        try:
            response = requests.get(audio_url, headers=headers, timeout=30)
            response.raise_for_status()  # Raise an exception for bad HTTP responses
        except requests.exceptions.RequestException as e:
            print(f"Error downloading audio for {ordinal_id}: {e}")
            return  # Skip this item and move to the next one
        
        if response.status_code == 200:
            # Create a temporary file to save the audio content
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_audio_file:
                temp_audio_file.write(response.content)
                temp_audio_file_path = temp_audio_file.name

            progress_logger.current_task = f"Processing audio for {ordinal_id}"
            
            # Load the WhisperX model
            model = whisperx.load_model("large-v2", device, compute_type=compute_type)

            # Load the audio from the temporary file
            audio = whisperx.load_audio(temp_audio_file_path)

            # Transcribe the audio
            transcription_result = model.transcribe(audio, batch_size=batch_size)

            # Load the alignment model based on the detected language
            model_a, metadata = whisperx.load_align_model(
                language_code=transcription_result["language"], 
                device=device
            )

            # Align the transcription with the audio
            result = whisperx.align(
                transcription_result["segments"], 
                model_a, 
                metadata, 
                audio, 
                device, 
                return_char_alignments=False
            )

            # Extract words with timestamps
            words_with_timestamps = [
                {
                    "word": w['word'], 
                    "start_time": w.get('start', 0),  # Default to 0 if 'start' is missing
                    "end_time": w.get('end', 0)       # Default to 0 if 'end' is missing
                }
                for segment in result["segments"] for w in segment.get("words", [])
            ]

            # Convert to DataFrame
            transcription_df = pd.DataFrame(words_with_timestamps, columns=["word", "start_time", "end_time"])

            # Save to CSV with the ordinal ID in the filename
            transcription_file_name = f"transcription_{ordinal_id}.csv"
            transcription_df.to_csv(transcription_file_name, index=False)

            # Save to JavaScript module
            constant_name = f"TD{ordinal_id}"
            js_module_file_name = f"transcription_{ordinal_id}.js"
            save_as_js_module(transcription_df, js_module_file_name, constant_name)

            # Print the DataFrame
            print(transcription_df)

            # Cleanup temporary audio file
            os.remove(temp_audio_file_path)
            print(f"Deleted temporary audio file: {temp_audio_file_path}")

        else:
            print(f"Failed to download audio: {response.status_code} {response.reason}")
    
    except Exception as e:
        print(f"An error occurred while processing {ordinal_id}: {e}")
        # Skip this item and move on to the next one

def escape_js_string(s):
    """Escape backslashes, double quotes, and single quotes for JavaScript."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'")

def save_as_js_module(dataframe, file_name, constant_name):
    """Save the transcription as a JavaScript module."""
    js_content = f"const {constant_name} = [\n"
    for _, row in dataframe.iterrows():
        word = escape_js_string(row['word'])
        js_content += f"  {{ word: '{word}', start_time: {row['start_time']}, end_time: {row['end_time']} }},\n"
    js_content += "];\n"

    with open(file_name, 'w') as js_file:
        js_file.write(js_content)

def process_ordinal_ids(ordinal_ids):
    """Iterate over the list of ordinal IDs and transcribe each."""
    try:
        progress_logger.start_logging()  # Start logging progress

        for ordinal_id in ordinal_ids:
            print(f"Processing ordinal ID: {ordinal_id}")
            transcribe_words(ordinal_id)

    finally:
        progress_logger.stop_logging()  # Stop logging when finished

# Example usage with a list of ordinal IDs


# Batch 20
ordinal_ids = [
    "f83249d3d713ed84cc0b5976825e7e643677d06b473933f25e36f662db85b7d3i0",
    "1cc121fe784f73d26c450a65a3a3b051b42d2df5ef1abad244638cd40b1dcf84i0",
    "a4c4641000fbbfa114b437ec235bdb9c13d9fffb37dc8524ef4fc994b6f1f058i0",
    "c62a9563dd0cbb6983741cb21c2abbc97d6e9186461c0a1d06a09c94f38a4c1fi0",
    "3a533772ec8d8cb0e5a3788d39952796d5d52b1d2a3a909d66432e26046e8174i0",
    "75ff40dffd330923cfab3fc84ef854c227e691fbb405b72f95709a6801a7204ei0",
    "206c9f696e8be19d796355f89c7e2619f5f60da00a3106b00f4671f52be3bd5ei0",
    "79fc0bb863d1e92de01d72578db0c37edecedc8298b24f8a87ca58d2a73cb157i5",
    "00eac848d2fa149e882f46a151a85fe9f93359b17297bf72648947ef526ed519i0",
    "00eac848d2fa149e882f46a151a85fe9f93359b17297bf72648947ef526ed519i4",
    "7b277753e3bde85c7ecb335d239725b8ce61377cab7288d5da0d400b1b7c83a8i0",
    "7b277753e3bde85c7ecb335d239725b8ce61377cab7288d5da0d400b1b7c83a8i4",
    "7b277753e3bde85c7ecb335d239725b8ce61377cab7288d5da0d400b1b7c83a8i8",
    "e15797434e61ab8c5979a8e2a794d1d6a250c05c4266b0b0a9fdd107ed2378d6i7",
    "e15797434e61ab8c5979a8e2a794d1d6a250c05c4266b0b0a9fdd107ed2378d6i3",
    "c739603c895db94b13590eae4ec77cdd932442806ef41936d093c6e9436d7bdfi6",
    "c739603c895db94b13590eae4ec77cdd932442806ef41936d093c6e9436d7bdfi2",
    "a38e95b20cc26fa06ddab7e190bbe9d73e2d227d92c4a411015d14d3bcfe5698i3",
    "a38e95b20cc26fa06ddab7e190bbe9d73e2d227d92c4a411015d14d3bcfe5698i7",
    "a38e95b20cc26fa06ddab7e190bbe9d73e2d227d92c4a411015d14d3bcfe5698i2",
    "5cd42cb93c7c53fcb731c29630e85e9a05edbf0c5aa49acbb0e1fbe718348867i6",
    "5cd42cb93c7c53fcb731c29630e85e9a05edbf0c5aa49acbb0e1fbe718348867i2",
    "5cd42cb93c7c53fcb731c29630e85e9a05edbf0c5aa49acbb0e1fbe718348867i10",
    "e5592b8f3313caf84c2e442882d98b637ed1e99786e6ebbe0892bf06437d6f2ai0",
    "d12354833dd6e60b97871f9c45561c360dd01a2a4bb0aca04f77cbff06e62532i0",
    "d95b671103b4d7fb370becc6ce0478386aa7d6e6bc90b8780c15e975dfd8e659i0",
    "93630cc51894a99c7b2c81ecbfd34c81ae1c0396cec66102f753430444e747a0i0",
    "fa8cc0ed2bc0cdb4b3c2cf5f6c761fef9c565ca000b4361cf359213a6010a1d2i0",
    "68dd59ed3523bcef8d51f27ab35b7187b6b76b09052af578b9c1160e905b6cb9i0",
    "fa8d08f273df7ece12c1d1ce57edf462fe051892b442eeac98e3fa91e05b74fdi0",
    "115ded4f15ac2b1cb8d7c70dfe1e4279b97d73cfea06203852e6925a14d9ee1ai0",
    "6dbbe9acbd7736521fbbe635277aed125f6735f4bf23daa988ccf9cc0aea57b0i0",
    "7c42769c1763cc8f045aada7914e8158223e45e7a4f197b49f918b1c005d36fci0",
    "6d26b95a8eb769b142dbaadd16b4cdbeab03c87b8bb67e65898c794d30f24d57i0",
    "f4d88aa02a2f3eaa25da067f8e3f24cdc30754ab424157e8de1a7bb21fef10e7i0",
    "df2f85d62ded7f13dc3d7cb75d33432d4507ecd86003673fa56e555d8e54128ci0",
    "afbd5ce0d11fbbe16cd6e6e1553d2cc64fcff63fdd4fcf759b45b033a656b39ci0",
    "53e12bab6fb5d5f2c83f3e0d2b70e6ac35e34480045662b30d4b1f46405b4e89i0"
]








process_ordinal_ids(ordinal_ids)


