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
import openai
import csv
import argparse  # Added for command-line arguments

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# OpenAI API Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

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

def download_class_labels(csv_url="https://raw.githubusercontent.com/tensorflow/models/master/research/audioset/yamnet/yamnet_class_map.csv"):
    """
    Download and parse the class labels CSV file.
    Returns a list where the index corresponds to the class ID.
    """
    try:
        response = requests.get(csv_url)
        response.raise_for_status()
        decoded_content = response.content.decode('utf-8').splitlines()
        reader = csv.reader(decoded_content)
        class_names = [row[1] for row in reader][1:]  # Skip header
        logger.info("Successfully loaded class labels.")
        return class_names
    except requests.exceptions.RequestException as e:
        logger.error(f"Error downloading class labels: {e}")
        return []

# Load class names from the CSV file
class_names = download_class_labels()
if class_names:
    logger.info(f"Total number of classes loaded: {len(class_names)}")
    logger.info(f"First 10 class names: {class_names[:10]}")
else:
    logger.error("No class names were loaded. Exiting the script.")
    exit(1)

# Load YAMNet model globally to avoid reloading for each classification
YAMNET_MODEL_HANDLE = 'https://tfhub.dev/google/yamnet/1'
try:
    yamnet_model = hub.load(YAMNET_MODEL_HANDLE)
    logger.info("YAMNet model loaded successfully.")
except Exception as e:
    logger.error(f"Error loading YAMNet model: {e}")
    exit(1)

def classify_audio(audio_path):
    """Classify the audio using YAMNet to determine its content type."""
    try:
        # Load the audio file
        sample_rate = 16000  # YAMNet expects audio at 16 kHz
        waveform, sr = librosa.load(audio_path, sr=sample_rate)
        waveform = waveform.astype(np.float32)

        # Run the model
        scores, embeddings, spectrogram = yamnet_model(waveform)

        # Debug: Log shapes of the outputs
        logger.debug(f"Scores shape: {scores.shape}")
        logger.debug(f"Embeddings shape: {embeddings.shape}")
        logger.debug(f"Spectrogram shape: {spectrogram.shape}")

        # Aggregate scores
        mean_scores = np.mean(scores, axis=0)
        top_class = class_names[np.argmax(mean_scores)]

        # Log the top classes
        top_n = 10  # Increased for more detailed analysis
        top_indices = np.argsort(mean_scores)[::-1][:top_n]
        top_classes = [(class_names[i], mean_scores[i]) for i in top_indices]
        logger.info(f"Top classes for {audio_path}: {top_classes}")

        return top_classes
    except Exception as e:
        logger.error(f"Error classifying audio {audio_path}: {e}")
        return []

def should_analyze_audio(top_classes):
    """Decide whether to analyze the audio based on its classification."""
    # Define categories that indicate musical content
    musical_categories = [
        'Music',
        'Instrumental',
        'Singing',
        'Saxophone',
        'Guitar',
        'Piano',
        'Drums',
        'Violin',
        'Bass',
        'Trumpet',
        'Electric guitar',
        'Acoustic guitar',
        'Synthesizer',
        'Bass guitar',
        'Percussion',
        'Horn',
        'Organ',
        'Flute',
        'Clarinet',
        'Backing vocals',
        'Solo vocals',
        # Add more as needed based on YAMNet's class list
    ]

    for class_name, score in top_classes:
        if class_name in musical_categories and score > 0.1:
            return True
    return False

def extract_tempo(audio_path):
    try:
        y, sr = librosa.load(audio_path, sr=16000)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        logger.info(f"Detected tempo for {audio_path}: {tempo} BPM")
        return tempo
    except Exception as e:
        logger.error(f"Error extracting tempo from {audio_path}: {e}")
        return None

def extract_key(audio_path):
    try:
        y, sr = librosa.load(audio_path, sr=16000)
        chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
        chroma_mean = np.mean(chroma, axis=1)
        key_index = chroma_mean.argmax()
        key = librosa.core.note_to_name(key_index)
        logger.info(f"Detected key for {audio_path}: {key}")
        return key
    except Exception as e:
        logger.error(f"Error extracting key from {audio_path}: {e}")
        return None

def analyze_audio_with_gpt4(audio_path, top_classes, tempo, key):
    """
    Analyze the audio to describe instruments and musicality using GPT-4.
    """
    try:
        # Construct a descriptive prompt based on top classes and extracted features
        prompt = (
            "Based on the detected sound events and the provided musical features, please provide a detailed analysis of the audio. "
            "Your analysis should include the following elements:\n"
            "- **Genre**: Identify the musical genre.\n"
            "- **Instruments**: List and describe the primary instruments detected.\n"
            "- **Tempo (BPM)**: Provide the estimated beats per minute.\n"
            "- **Key**: Specify the musical key.\n"
            "- **Overall Musicality**: Comment on the arrangement, harmony, and other musical aspects.\n\n"
            "Detected Sound Events:\n"
        )
        
        # Format the top classes into a readable format
        for class_name, score in top_classes:
            prompt += f"- {class_name}: {score:.2f}\n"
        
        # Include extracted musical features
        if tempo:
            prompt += f"\nDetected Tempo (BPM): {tempo}\n"
        if key:
            prompt += f"Detected Key: {key}\n"
        
        prompt += "\nProvide your analysis below:\n"
        
        # Call GPT-4 API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert musicologist."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,  # Adjust based on desired response length
            temperature=0.7,  # Adjust for creativity vs. accuracy
        )
        
        analysis = response['choices'][0]['message']['content'].strip()
        logger.info(f"GPT-4 Analysis for {audio_path}: {analysis}")
        
        return analysis
    except Exception as e:
        logger.error(f"Error analyzing audio with GPT-4 for {audio_path}: {e}")
        return ""

def process_audio(ordinal_id, audio_path):
    try:
        # Classify the audio to determine its content type
        top_classes = classify_audio(audio_path)
        if not should_analyze_audio(top_classes):
            logger.info(f"Audio {ordinal_id} classified as non-musical. Skipping analysis.")
            return ""

        # Extract additional musical features
        tempo = extract_tempo(audio_path)
        key = extract_key(audio_path)

        # Proceed with analysis
        analysis = analyze_audio_with_gpt4(audio_path, top_classes, tempo, key)
        return analysis
    except Exception as e:
        logger.error(f"An error occurred while processing {ordinal_id}: {e}")
        return ""

def escape_js_string(s):
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'").replace("\n", "\\n")

def save_analysis_as_js_module(analysis, ordinal_id):
    constant_name = f"TD{ordinal_id}"
    # Escape single quotes and handle multi-line strings
    escaped_analysis = escape_js_string(analysis)
    js_content = f"const {constant_name} = `{escaped_analysis}`;\nexport default {constant_name};\n"
    
    with open(f"analysis_{ordinal_id}.js", 'w') as js_file:
        js_file.write(js_content)

def analyze_audio_main(ordinal_id):
    progress_logger.current_task = f"Fetching and processing audio for {ordinal_id}"
    audio_path = fetch_audio(ordinal_id)

    if audio_path:
        try:
            analysis = process_audio(ordinal_id, audio_path)
            if analysis:
                save_analysis_as_js_module(analysis, ordinal_id)
                logger.info(f"Analysis for {ordinal_id}: {analysis}")
            else:
                logger.info(f"No analysis generated for {ordinal_id}.")
        finally:
            try:
                os.remove(audio_path)
                logger.debug(f"Deleted temporary audio file: {audio_path}")
            except OSError as e:
                logger.error(f"Error deleting temporary file {audio_path}: {e}")

def process_ordinal_ids(ordinal_ids):
    progress_logger.start()
    try:
        for ordinal_id in ordinal_ids:
            logger.info(f"Processing ordinal ID: {ordinal_id}")
            analyze_audio_main(ordinal_id)
    finally:
        progress_logger.stop()  # Stop logging when finished

def main():
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Ordinal Audio Transcriber with GPT-4 Analysis")
    parser.add_argument('ordinal_ids', metavar='N', type=str, nargs='+',
                        help='List of ordinal IDs to process')
    args = parser.parse_args()

    # Ensure the OpenAI API key is set
    if not OPENAI_API_KEY:
        logger.error("OpenAI API key not set. Please set the OPENAI_API_KEY environment variable.")
        exit(1)

    process_ordinal_ids(args.ordinal_ids)

if __name__ == "__main__":
    main()