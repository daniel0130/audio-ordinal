import os
import requests
from pydub import AudioSegment
from pydub.silence import split_on_silence
import speech_recognition as sr
import pandas as pd

def download_audio(url, output_path):
    response = requests.get(url)
    with open(output_path, 'wb') as f:
        f.write(response.content)
    print(f"Audio downloaded to {output_path}")

def transcribe_with_timecodes(audio_path, language="en-US"):
    recognizer = sr.Recognizer()
    sound = AudioSegment.from_mp3(audio_path)

    chunks = split_on_silence(
        sound,
        min_silence_len=500,
        silence_thresh=sound.dBFS-14,
        keep_silence=500
    )

    transcript = []
    start_time = 0.0

    for i, chunk in enumerate(chunks):
        chunk_path = f"chunk{i}.wav"
        chunk.export(chunk_path, format="wav")
        
        with sr.AudioFile(chunk_path) as source:
            audio_listened = recognizer.record(source)
            try:
                text = recognizer.recognize_google(audio_listened, language=language)
                duration = len(chunk) / 1000.0
                end_time = start_time + duration
                
                words = text.split()
                word_durations = duration / len(words)
                
                for j, word in enumerate(words):
                    word_start_time = round(start_time + j * word_durations, 3)
                    word_end_time = round(word_start_time + word_durations, 3)
                    transcript.append({
                        "word": word,
                        "start_time": word_start_time,
                        "end_time": word_end_time
                    })
                
                start_time = end_time
            except sr.UnknownValueError:
                print("Could not understand audio")
            except sr.RequestError as e:
                print(f"Could not request results; {e}")
        
        os.remove(chunk_path)

    return transcript

def get_ordinal_id(url):
    return url.split('/')[-1]

# URL of the audio file
audio_url = "https://ordinals.hiro.so/content/2d471092cf6504e4e389eef609bb98cabc844fd054157b4b008ca3c2e66f67adi0"
audio_path = "downloaded_audio.mp3"

# Download the audio file
download_audio(audio_url, audio_path)

# Transcribe the audio file
transcript = transcribe_with_timecodes(audio_path)

# Get the ordinal ID from the URL
ordinal_id = get_ordinal_id(audio_url)

# Create a DataFrame to display the transcription with time codes
transcription_df = pd.DataFrame(transcript, columns=["word", "start_time", "end_time"])

# Save to CSV with the ordinal ID in the filename
transcription_file_name = f"transcription_{ordinal_id}.csv"
transcription_df.to_csv(transcription_file_name, index=False)

# Print the DataFrame
print(transcription_df)

# Delete the downloaded audio file
os.remove(audio_path)
print(f"Deleted audio file: {audio_path}")
