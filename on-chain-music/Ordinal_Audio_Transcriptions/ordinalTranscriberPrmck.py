import whisperx
import requests
from io import BytesIO
import tempfile
import pandas as pd
import os

def transcribe_words(audio_url):
    device = "cpu"
    compute_type = "int8"
    batch_size = 16

    # Set up headers to mimic a browser request
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36"
    }

    # Fetch the audio file from the URL with the headers
    response = requests.get(audio_url, headers=headers)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Create a temporary file to save the audio content
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_audio_file:
            temp_audio_file.write(response.content)
            temp_audio_file_path = temp_audio_file.name

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

        # Print the result structure for debugging
        print(result["segments"])

        # Extract words with timestamps
       # Corrected list comprehension based on the actual keys in the structure
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

        # Get the ordinal ID from the URL
        ordinal_id = get_ordinal_id(audio_url)

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

def get_ordinal_id(url):
    """Extract the ordinal ID from the given URL."""
    return url.split('/')[-1]

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

# Example usage
audio_url = "https://ordinals.com/content/c3842d731fbd59dc1b40d7684681813c02c9bf081bfd825e503f2085ff8c2c75i0"
transcribe_words(audio_url)
