import whisperx
import requests
import tempfile
import os
import time
import threading
import logging
import numpy as np
import librosa
import tensorflow as tf
import tensorflow_hub as hub

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

BASE_URL = "https://ordinals.com/content/"
HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

class ProgressLogger(threading.Thread):
    def __init__(self):
        super().__init__()
        self.current_task = "Starting..."
        self._stop_flag = threading.Event()

    def run(self):
        while not self._stop_flag.is_set():
            logger.info(f"Status: {self.current_task}")
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
        logger.error(f"Error downloading audio for {ordinal_id}: {e}")
        return None

def classify_audio(audio_path):
    """Classify the audio using YAMNet to determine its content type."""
    try:
        # Load the audio file
        sample_rate = 16000  # YAMNet expects audio at 16 kHz
        waveform, sr = librosa.load(audio_path, sr=sample_rate)
        waveform = waveform.astype(np.float32)

        # Load YAMNet model
        yamnet_model_handle = 'https://tfhub.dev/google/yamnet/1'
        yamnet_model = hub.load(yamnet_model_handle)

        # Run the model
        scores, embeddings, spectrogram = yamnet_model(waveform)
        class_names = yamnet_model.class_names.numpy()

        # Aggregate scores
        mean_scores = np.mean(scores, axis=0)
        top_class = class_names[np.argmax(mean_scores)].decode('utf-8')

        # Log the top classes
        top_n = 5
        top_indices = np.argsort(mean_scores)[::-1][:top_n]
        top_classes = [(class_names[i].decode('utf-8'), mean_scores[i]) for i in top_indices]
        logger.info(f"Top classes for {audio_path}: {top_classes}")

        return top_classes
    except Exception as e:
        logger.error(f"Error classifying audio {audio_path}: {e}")
        return []

def should_transcribe_audio(top_classes):
    """Decide whether to transcribe the audio based on its classification."""
    # Define categories that indicate speech or vocal content
    speech_categories = ['Speech', 'Narration, monologue', 'Conversation', 'Narration', 'Singing', 'Rap']

    for class_name, score in top_classes:
        if class_name in speech_categories and score > 0.1:
            return True
    return False

def detect_speech_segments(audio_path):
    """Detect nonsilent segments (speech) in the audio."""
    # This function can remain the same or be adjusted based on classification
    pass  # Placeholder for brevity

def process_audio(ordinal_id, audio_path, model):
    try:
        # Classify the audio to determine its content type
        top_classes = classify_audio(audio_path)
        if not should_transcribe_audio(top_classes):
            logger.info(f"Audio {ordinal_id} classified as non-speech. Skipping transcription.")
            return []

        # Proceed with transcription as before
        audio = whisperx.load_audio(audio_path)
        audio_duration = len(audio) / 16000  # Convert samples to seconds

        # Detect speech segments if necessary
        # speech_segments = detect_speech_segments(audio_path)
        # Adjust timings based on speech detection

        # Transcribe audio
        transcription_result = model.transcribe(audio, batch_size=16)
        model_a, metadata = whisperx.load_align_model(transcription_result["language"], device="cpu")
        result = whisperx.align(
            transcription_result["segments"], model_a, metadata, audio, device="cpu", return_char_alignments=False
        )

        # Process words
        words_with_corrected_timing = []
        for segment in result["segments"]:
            for word in segment.get("words", []):
                start_time = word.get('start', 0)
                end_time = word.get('end', 0)
                if start_time >= end_time:
                    continue
                words_with_corrected_timing.append({
                    "word": word['word'],
                    "start_time": start_time,
                    "end_time": end_time
                })

        return words_with_corrected_timing
    except Exception as e:
        logger.error(f"An error occurred while processing {ordinal_id}: {e}")
        return []

def save_transcription_as_js_module(words, ordinal_id):
    constant_name = f"TD{ordinal_id}"
    js_content = f"const {constant_name} = [\n"
    js_content += ''.join(
        f"  {{ word: '{escape_js_string(word_dict['word'])}', start_time: {word_dict['start_time']}, end_time: {word_dict['end_time']} }},\n"
        for word_dict in words
    )
    js_content += "];\n"
    with open(f"transcription_{ordinal_id}.js", 'w') as js_file:
        js_file.write(js_content)

def escape_js_string(s):
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'")

def transcribe_words(ordinal_id, model):
    progress_logger.current_task = f"Fetching and processing audio for {ordinal_id}"
    audio_path = fetch_audio(ordinal_id)

    if audio_path:
        words = process_audio(ordinal_id, audio_path, model)
        if words:
            save_transcription_as_js_module(words, ordinal_id)
            logger.info(f"Transcription for {ordinal_id}: {words}")
        else:
            logger.info(f"No transcription generated for {ordinal_id}.")
        os.remove(audio_path)
        logger.debug(f"Deleted temporary audio file: {audio_path}")

def process_ordinal_ids(ordinal_ids, model):
    progress_logger.start()
    try:
        for ordinal_id in ordinal_ids:
            logger.info(f"Processing ordinal ID: {ordinal_id}")
            transcribe_words(ordinal_id, model)
    finally:
        progress_logger.stop()  # Stop logging when finished

# Load the WhisperX model once
model = whisperx.load_model("large-v2", device="cpu", compute_type="int8")

# Example usage with a list of ordinal IDs
ordinal_ids = [
    "f83249d3d713ed84cc0b5976825e7e643677d06b473933f25e36f662db85b7d3i0",
    "afbd5ce0d11fbbe16cd6e6e1553d2cc64fcff63fdd4fcf759b45b033a656b39ci0",
    "53e12bab6fb5d5f2c83f3e0d2b70e6ac35e34480045662b30d4b1f46405b4e89i0"
]

process_ordinal_ids(ordinal_ids, model)
