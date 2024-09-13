import whisperx
import requests
from io import BytesIO
import tempfile
import pandas as pd
import os
import time
import threading
import subprocess
import concurrent.futures

BASE_URL = "https://ordinals.com/content/"
MAX_RETRIES = 3
CONCURRENCY_LIMIT = 5
EXTRACTION_TIMEOUT = 120  # Extended timeout for larger files

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

def extract_audio_from_video(video_file_path, retries=MAX_RETRIES):
    """Extract audio from video using ffmpeg with retry mechanism."""
    temp_audio_path = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False).name
    command = [
        "ffmpeg", "-i", video_file_path, "-q:a", "0", "-map", "a", temp_audio_path
    ]
    attempt = 0
    while attempt < retries:
        try:
            subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, timeout=EXTRACTION_TIMEOUT)
            return temp_audio_path
        except subprocess.TimeoutExpired:
            print(f"Audio extraction timed out for {video_file_path}, attempt {attempt + 1}/{retries}")
        except subprocess.CalledProcessError as e:
            print(f"ffmpeg failed for {video_file_path}: {e}")
        attempt += 1
    print(f"Failed to extract audio after {retries} attempts for {video_file_path}")
    return None

def download_file_with_retry(url, headers, retries=MAX_RETRIES):
    """Attempt to download the file with retry logic."""
    attempt = 0
    while attempt < retries:
        try:
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()  # Raise exception for HTTP errors
            if response.status_code == 200 and response.content:
                return response
        except requests.exceptions.RequestException as e:
            attempt += 1
            print(f"Attempt {attempt}/{retries} failed: {e}")
            if attempt == retries:
                print(f"Failed to download file after {retries} attempts.")
                return None

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

        # Fetch the audio or video file with retries
        response = download_file_with_retry(audio_url, headers)
        if not response:
            return  # Skip if download failed

        # Determine if the content is a video or audio
        content_type = response.headers.get('Content-Type', '')
        is_video = "video" in content_type

        if response.status_code == 200:
            # Create a temporary file to save the content (audio or video)
            with tempfile.NamedTemporaryFile(suffix=".mp4" if is_video else ".mp3", delete=False) as temp_file:
                temp_file.write(response.content)
                temp_file_path = temp_file.name

            # Extract audio if it's a video
            if is_video:
                progress_logger.current_task = f"Extracting audio from video for {ordinal_id}"
                temp_audio_file_path = extract_audio_from_video(temp_file_path)
                os.remove(temp_file_path)  # Remove the original video file
                if not temp_audio_file_path:
                    print(f"Failed to extract audio from video for {ordinal_id}")
                    return  # Skip this item if audio extraction failed
            else:
                temp_audio_file_path = temp_file_path  # If it's audio, just use the file directly

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
    """Process a list of ordinal IDs concurrently with a concurrency limit."""
    try:
        progress_logger.start_logging()  # Start logging progress

        # Process the videos in parallel with a concurrency limit
        with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENCY_LIMIT) as executor:
            future_to_ordinal = {executor.submit(transcribe_words, ordinal_id): ordinal_id for ordinal_id in ordinal_ids}
            for future in concurrent.futures.as_completed(future_to_ordinal):
                ordinal_id = future_to_ordinal[future]
                try:
                    future.result()
                except Exception as exc:
                    print(f"Ordinal ID {ordinal_id} generated an exception: {exc}")

    finally:
        progress_logger.stop_logging()  # Stop logging when finished

# Batch 23 VIDEO FILES
ordinal_ids = [
    "90ec964a3e728ecbf5ae39e042bd85b89611d06fc1c0a54cd07d8193aa1aa664i0",
    "a58f5b7a3bea29e37fb2690c7493cf56b71edce8b45229c59fc0aa2470fdff3bi0",
    "4a505ca26f78045d04b63cf8904d59a46f142d7d5476430002f942ba25f56666i0",
    "fff1afcd0ef864ed153bdd3520070f5ad3ea9d5aac35cb958a996ce08adb3053i0",
    "b5a7e05f28d00e4a791759ad7b6bd6799d856693293ceeaad9b0bb93c8851f7fi0",
    "9f5ee2f2afc98b808d5d888c6382bcd6a4abb8f6d4fa5779d10d88cec42ed3f2i0",
    "fa76c322a470223fd55e15586ca268f1b894a42daa019784af9349d13304533ci0",
    "5156bcfb78f2c81c0d5188cea7f28efb2fe6102ab7471c0e7ac8d38436fe88cbi0",
    "fa99c4ed98e2b02a05ef88ace0c401d3ef4101d95868fcd8d8569ff869e27298i0",
    "6f4552b0539f48b5d71331b1d572e0fe7e21c8b9913e9eb7de01d6a9a321ec84i0",
    "07bbaa2d7a6358fb08e8b31c2b01c49a17fd28b4498b18e0a2c862c05692ae99i0",
    "4415a7ea982dc94007d7df9ed9da6e496e623d147560c48ed9f511b8c9a535bdi0",
    "9413c5a96ed0cc2b873f750badfa03fd789a85695799d40d4855dd9259a18534i0",
    "a5010922881d669011bb6eba593aeb01a597f7ff99d37d4568340bf0fb9dea0bi0",
    "a10637b5b469bd42375690190f8978f44f7902fdc143779b41f89cfa007777d7i0",
    "64230750f6be5579506fbb3ada7d782253f1da9b4f6724b6aa1bcb032ab77411i0",
    "90754e4a4905b2607d8408f3180e30b9e6c9b13a394d6798f67632da12424803i0",
    "824eab99ccced066616232a33f242f067c960a886fcc5a7c03f97ce99c4d3d25i0",
    "03aba4ac15aef62535f525ad1de35aead2b6d0229125453fa76650f29e768e8ci0",
    "9a9a339f78d7cbe32cc35a70443a1eb4d56852a033df3af15d20414c717715f8i0",
    "e1a12e5d314512e12bc36fc8ca74ce8b832c149fa82287af4fb91b9ccbfc8a72i0",
    "661562bfc5be56d6d257e64814ca487d81f44ff72847b89537c267e6c7d61877i0",
    "cc808e812f608120b42754e0757515832dcc922b7bad2e09a647c65297c14060i0",
    "5b41f7f8af9b724005658450e30c4aaf06b42ec6218fd1c9c45b9d48cee153b1i0",
    "779b53221183cdee5168671b696cf99f60b6be0ce596777ec5f066bf9be44fbfi0",
    "5e2ccb6c4d6093e3cf341ba077a6a09d5309d4dbc5af2b71a16e899e84b59a40i0",
    "8885c584b21bb44723a60383dff577d71911f71f56fc1f292ee14f957cdd1907i0",
    "be6f99a5046dee6f0b0a41e90d895c8f8c3f0fb2feeae4ffd7c58253d0def0e2i0",
    "7e227b9f2c1c47aae4e2ff5e91984210c6b8bb8f8344e89b06b3629ea9357516i0"
]


process_ordinal_ids(ordinal_ids)
