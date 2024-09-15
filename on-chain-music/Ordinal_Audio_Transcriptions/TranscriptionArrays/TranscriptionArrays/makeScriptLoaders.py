import os

# Function to generate the transcription array with the 'TD' prefix
def generate_transcription_name(js_file):
    array_name = js_file.replace('transcription_', '').replace('.js', '')
    return f"TD{array_name}"

# Function to process all transcription files and generate both script tags and the allTranscriptions array
def process_transcription_files(directory, output_directory):
    try:
        # Ensure output directory exists
        if not os.path.exists(output_directory):
            os.makedirs(output_directory)
        
        # List all files in the specified directory
        files = os.listdir(directory)

        # Filter only .js files that start with 'transcription_' and end with '.js'
        js_files = [file for file in files if file.startswith('transcription_') and file.endswith('.js')]

        # Dictionary to store unique generated script tags and allTranscriptions array entries
        script_tags = {}
        all_transcriptions_entries = {}

        # Process each transcription file
        for js_file in js_files:
            input_path = os.path.join(directory, js_file)
            output_path = os.path.join(output_directory, js_file)

            # Read the original file content
            with open(input_path, 'r') as file:
                original_content = file.read()

            # Write the original content to the new file in the output directory
            with open(output_path, 'w') as file:
                file.write(original_content)
            
            print(f'Updated transcription file saved as {output_path}')

            # Generate the transcription name
            transcription_name = generate_transcription_name(js_file)

            # Ensure no duplicate script tag or transcription entry
            if transcription_name not in script_tags:
                # Generate the script tag for this file
                script_tag = f'<script src="./{output_directory}/{js_file}"></script>'
                script_tags[transcription_name] = script_tag

            # Ensure no duplicate entry for allTranscriptions
            if transcription_name not in all_transcriptions_entries:
                all_transcriptions_entry = f'{{ name: "{transcription_name}", transcription: {transcription_name} }}'
                all_transcriptions_entries[transcription_name] = all_transcriptions_entry

        # Perform cleanup: remove any IDs with " 2" at the end
        script_tags = {k: v for k, v in script_tags.items() if " 2" not in k}
        all_transcriptions_entries = {k: v for k, v in all_transcriptions_entries.items() if " 2" not in k}

        return list(script_tags.values()), list(all_transcriptions_entries.values())

    except Exception as e:
        print(f"An error occurred: {e}")
        return [], []

# Function to write the script tags to a file
def write_script_tags(script_tags, output_file):
    try:
        with open(output_file, 'w') as f:
            for tag in script_tags:
                f.write(tag + '\n')
        print(f'Script tags have been written to {output_file}')
    except Exception as e:
        print(f"An error occurred while writing to the file: {e}")

# Function to write the allTranscriptions array to a file
def write_all_transcriptions_array(all_transcriptions_entries, output_file):
    try:
        with open(output_file, 'w') as f:
            f.write('const allTranscriptions = [\n')
            for entry in all_transcriptions_entries:
                f.write(f'    {entry},\n')
            f.write('];\n')
        print(f'AllTranscriptions array has been written to {output_file}')
    except Exception as e:
        print(f"An error occurred while writing the allTranscriptions array: {e}")

# Set the directory where the .js files are located
directory = '.'  # Current directory

# Output directory to store the updated files
output_directory = 'TranscriptionArrays'

# Output files to store the generated script tags and allTranscriptions array
script_tags_output_file = 'script_tags.html'
all_transcriptions_output_file = 'all_transcriptions.js'

# Process all transcription files and generate script tags and allTranscriptions array entries
script_tags, all_transcriptions_entries = process_transcription_files(directory, output_directory)

# Write the script tags to an output file
write_script_tags(script_tags, script_tags_output_file)

# Write the allTranscriptions array to an output file
write_all_transcriptions_array(all_transcriptions_entries, all_transcriptions_output_file)
