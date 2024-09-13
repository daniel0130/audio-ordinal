import whisperx
import requests
import tempfile
import pandas as pd
import os
import time
import threading
from pydub import AudioSegment
from pydub.silence import detect_silence

BASE_URL = "https://ordinals.com/content/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36"
}

class ProgressLogger(threading.Thread):
    def __init__(self):
        super().__init__()
        self.current_task = "Starting..."
        self._stop_flag = threading.Event()

    def run(self):
        while not self._stop_flag.is_set():
            print(f"Status: {self.current_task}")
            time.sleep(10)

    def stop(self):
        self._stop_flag.set()
        self.join()

progress_logger = ProgressLogger()

def fetch_audio(ordinal_id):
    audio_url = f"{BASE_URL}{ordinal_id}"
    try:
        response = requests.get(audio_url, headers=HEADERS, timeout=30)
        response.raise_for_status()
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_audio_file:
            temp_audio_file.write(response.content)
            return temp_audio_file.name
    except requests.exceptions.RequestException as e:
        print(f"Error downloading audio for {ordinal_id}: {e}")
        return None

def detect_leading_silence(temp_audio_file_path):
    """Detect leading silence duration in milliseconds."""
    audio = AudioSegment.from_mp3(temp_audio_file_path)
    silence_threshold = -50  # Adjust threshold for silence detection (in dB)
    silence_duration = detect_silence(audio, min_silence_len=1000, silence_thresh=silence_threshold, seek_step=10)
    
    if silence_duration and silence_duration[0][0] > 0:
        # Return the duration of the leading silence in seconds
        return silence_duration[0][0] / 1000
    return 0

def process_audio(ordinal_id, temp_audio_file_path):
    try:
        model = whisperx.load_model("large-v2", device="cpu", compute_type="int8")
        audio = whisperx.load_audio(temp_audio_file_path)
        leading_silence = detect_leading_silence(temp_audio_file_path)
        print(f"Detected leading silence of {leading_silence} seconds for {ordinal_id}.")

        transcription_result = model.transcribe(audio, batch_size=16)
        model_a, metadata = whisperx.load_align_model(transcription_result["language"], device="cpu")
        result = whisperx.align(
            transcription_result["segments"], model_a, metadata, audio, device="cpu", return_char_alignments=False
        )

        words_with_corrected_timing = []
        for segment in result["segments"]:
            for word in segment.get("words", []):
                # Adjust word timings by adding the leading silence duration
                start_time = word.get('start', 0) + leading_silence
                end_time = word.get('end', 0) + leading_silence
                words_with_corrected_timing.append({
                    "word": word['word'],
                    "start_time": start_time,
                    "end_time": end_time
                })

        return words_with_corrected_timing
    except Exception as e:
        print(f"An error occurred while processing {ordinal_id}: {e}")
        return []

def save_transcription_as_csv(words, ordinal_id):
    transcription_df = pd.DataFrame(words, columns=["word", "start_time", "end_time"])
    transcription_df.to_csv(f"transcription_{ordinal_id}.csv", index=False)
    return transcription_df

def save_transcription_as_js_module(dataframe, ordinal_id):
    constant_name = f"TD{ordinal_id}"
    js_content = f"const {constant_name} = [\n"
    js_content += ''.join(
        f"  {{ word: '{escape_js_string(row['word'])}', start_time: {row['start_time']}, end_time: {row['end_time']} }},\n"
        for _, row in dataframe.iterrows()
    )
    js_content += "];\n"
    with open(f"transcription_{ordinal_id}.js", 'w') as js_file:
        js_file.write(js_content)

def escape_js_string(s):
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'")

def transcribe_words(ordinal_id):
    progress_logger.current_task = f"Fetching and processing audio for {ordinal_id}"
    temp_audio_file_path = fetch_audio(ordinal_id)

    if temp_audio_file_path:
        words = process_audio(ordinal_id, temp_audio_file_path)
        if words:
            transcription_df = save_transcription_as_csv(words, ordinal_id)
            save_transcription_as_js_module(transcription_df, ordinal_id)
            print(transcription_df)
        os.remove(temp_audio_file_path)
        print(f"Deleted temporary audio file: {temp_audio_file_path}")

def process_ordinal_ids(ordinal_ids):
    progress_logger.start()
    try:
        for ordinal_id in ordinal_ids:
            print(f"Processing ordinal ID: {ordinal_id}")
            transcribe_words(ordinal_id)
    finally:
        progress_logger.stop()  # Stop logging when finished

# Example usage with a list of ordinal IDs
ordinal_ids = [
    "f83249d3d713ed84cc0b5976825e7e643677d06b473933f25e36f662db85b7d3i0",
    "afbd5ce0d11fbbe16cd6e6e1553d2cc64fcff63fdd4fcf759b45b033a656b39ci0",
    "53e12bab6fb5d5f2c83f3e0d2b70e6ac35e34480045662b30d4b1f46405b4e89i0"
]

process_ordinal_ids(ordinal_ids)
