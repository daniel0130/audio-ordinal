import os

# Function to update the content of a transcription file
def update_transcription_file(content, file_name):
    # Get the array name (assuming it's in the form "const TD...")
    array_name = file_name.replace('transcription_', '').replace('.js', '')
    updated_content = f"""
window.transcriptions = window.transcriptions || {{}};
window.transcriptions.TD{array_name} = {content};
"""
    return updated_content

# Function to process all transcription files in the current directory
def process_transcription_files(directory, output_directory):
    try:
        # Ensure output directory exists
        if not os.path.exists(output_directory):
            os.makedirs(output_directory)
        
        # List all files in the specified directory
        files = os.listdir(directory)

        # Filter only .js files that start with 'transcription_' and end with '.js'
        js_files = [file for file in files if file.startswith('transcription_') and file.endswith('.js')]

        # Process each transcription file
        for js_file in js_files:
            input_path = os.path.join(directory, js_file)
            output_path = os.path.join(output_directory, js_file)

            # Read the original file content
            with open(input_path, 'r') as file:
                original_content = file.read()

            # Update the content
            updated_content = update_transcription_file(original_content.strip(), js_file)

            # Write the updated content to the new file in the output directory
            with open(output_path, 'w') as file:
                file.write(updated_content)
            
            print(f'Updated transcription file saved as {output_path}')

    except Exception as e:
        print(f"An error occurred: {e}")

# Set the directory where the .js files are located
directory = '.'  # Update this with your actual folder path if needed

# Output directory to store the updated files
output_directory = 'TranscriptionArrays'

# Process all transcription files and save updated versions
process_transcription_files(directory, output_directory)
