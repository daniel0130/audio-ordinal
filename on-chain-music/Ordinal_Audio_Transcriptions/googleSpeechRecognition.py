from pydub import AudioSegment
import speech_recognition as sr
import tempfile  # Import tempfile for temporary file handling


# Load the audio file
audio_file_path = '/Users/jim.btc/Downloads/f9bd2dad595602e5699b77fefa15bb24336bdc492f7dc571cd026fc4cd59eb23i0.mp3'

# Convert audio file to WAV for speech recognition processing
print("Converting MP3 to WAV...")
audio = AudioSegment.from_mp3(audio_file_path)
wav_path = "temp_audio.wav"
audio.export(wav_path, format="wav")
print(f"Conversion complete. WAV file saved at {wav_path}")

# Initialize recognizer
recognizer = sr.Recognizer()

# Expanded list of languages for checking
languages_to_try = {
    "ja-JP": "Japanese",
    "ko-KR": "Korean",
    "zh-CN": "Chinese (Mandarin)",
    "zh-TW": "Chinese (Taiwanese Mandarin)",
    "th-TH": "Thai",
    "vi-VN": "Vietnamese",
    "hi-IN": "Hindi",
    "bn-BD": "Bengali",
    "ta-IN": "Tamil",
    "ml-IN": "Malayalam",
    "ms-MY": "Malay",
    "id-ID": "Indonesian",
    "km-KH": "Khmer",
    "lo-LA": "Lao",
    "si-LK": "Sinhala",
    "my-MM": "Burmese",
    # "ur-PK": "Urdu",
    # "ar-SA": "Arabic",
    # "fa-IR": "Farsi",
    # "he-IL": "Hebrew",
    # "tr-TR": "Turkish",
    # "ru-RU": "Russian",
    # "uk-UA": "Ukrainian",
    # "fr-FR": "French",
    # "de-DE": "German",
    # "es-ES": "Spanish",
    # "pt-PT": "Portuguese",
    # "it-IT": "Italian",
    # "nl-NL": "Dutch",
    # "el-GR": "Greek",
    # "pl-PL": "Polish",
    # "sv-SE": "Swedish",
    # "no-NO": "Norwegian",
    # "fi-FI": "Finnish",
    # "da-DK": "Danish",
    # "cs-CZ": "Czech",
    # "hu-HU": "Hungarian",
    # "ro-RO": "Romanian",
    # "bg-BG": "Bulgarian",
    # "sl-SI": "Slovenian",
    # "hr-HR": "Croatian",
    # "sr-RS": "Serbian",
    # "sk-SK": "Slovak",
    # "et-EE": "Estonian",
    # "lt-LT": "Lithuanian",
    # "lv-LV": "Latvian",
    # "sw-KE": "Swahili",
    # "af-ZA": "Afrikaans",
    # "yo-NG": "Yoruba",
    # "ig-NG": "Igbo",
    # "ha-NE": "Hausa",
    # Add more languages as needed...
}
# Helper function to adjust audio speed
def change_audio_speed(audio, speed=1.0):
    return audio.speedup(playback_speed=speed)

# Helper function to adjust audio pitch
def pitch_down(audio, semitones=-2):
    return audio._spawn(audio.raw_data, overrides={
        "frame_rate": int(audio.frame_rate * (2.0 ** (semitones / 12.0)))
    }).set_frame_rate(audio.frame_rate)

# List to store confidence values
confidence_values = []

# Function to process audio with recognizer and log results
def transcribe_audio_with_adjustments(audio_segment, recognizer, language_code, language_name, adjustments=None):
    with tempfile.NamedTemporaryFile(suffix=".wav") as temp_file:
        # Apply adjustments to the audio if any (e.g., speed or pitch changes)
        if adjustments:
            for adjustment in adjustments:
                audio_segment = adjustment(audio_segment)
        
        # Export the adjusted audio to a temporary WAV file
        audio_segment.export(temp_file.name, format="wav")
        
        # Process audio with speech recognizer
        with sr.AudioFile(temp_file.name) as source:
            recognizer.adjust_for_ambient_noise(source)  # Adjust for background noise
            audio_data = recognizer.record(source)
        
        try:
            print(f"Attempting transcription using {language_name} ({language_code}) with adjustments...")
            transcription = recognizer.recognize_google(audio_data, language=language_code, show_all=True)  # Try each language
            if transcription:
                print(f"Full Transcription Response for {language_name}: {transcription}")
                if 'alternative' in transcription:
                    best_transcription = transcription['alternative'][0]['transcript']
                    confidence = transcription['alternative'][0].get('confidence', 0)  # Default confidence to 0 if not found
                    print(f"Best Transcription for {language_name}: {best_transcription}")
                    print(f"Confidence Level: {confidence}")
                    confidence_values.append((language_name, confidence))  # Store the language and confidence value
                    return True  # Stop once a match is found
            else:
                print(f"No valid transcription found for {language_name}.")
        except sr.UnknownValueError:
            print(f"Google Speech Recognition could not understand the audio in {language_name}.")
        except sr.RequestError as e:
            print(f"Could not request results from Google Speech Recognition for {language_name}; {e}")
        return False

# Attempt different audio adjustments (slowed down, pitched down, etc.)
adjustments_to_try = [
    [change_audio_speed],  # Speed up slightly
    [lambda audio: change_audio_speed(audio, speed=0.8)],  # Slow down
    [lambda audio: pitch_down(audio, semitones=-2)],  # Pitch down
]

# Process the audio file with different languages and adjustments
for language_code, language_name in languages_to_try.items():
    for adjustments in adjustments_to_try:
        if transcribe_audio_with_adjustments(audio, recognizer, language_code, language_name, adjustments):
            print(f"Successfully transcribed with {language_name} using adjustments.")
            break  # Stop if a transcription was found

# If no transcription was found after all attempts
else:
    print("No valid transcription could be obtained from any language or adjustment.")

# Sort confidence values and display the top three languages
if confidence_values:
    sorted_confidence = sorted(confidence_values, key=lambda x: x[1], reverse=True)
    print("\nTop Confidence Levels:")
    for lang, conf in sorted_confidence:
        print(f"{lang}: {conf * 100:.2f}% confidence")
else:
    print("No transcription confidence values to display.")
