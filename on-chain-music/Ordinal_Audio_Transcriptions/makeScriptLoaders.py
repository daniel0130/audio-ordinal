import os

def generate_script_tags(directory):
    try:
        # List all files in the specified directory
        files = os.listdir(directory)

        # Filter only .js files that start with 'transcription_' and end with '.js'
        js_files = [file for file in files if file.startswith('transcription_') and file.endswith('.js')]

        # Generate the <script> tags for each valid .js file
        script_lines = []
        for js_file in js_files:
            # Create a simple <script src="..."> tag
            script_line = f'<script src="./{js_file}"></script>'
            script_lines.append(script_line)

        return script_lines

    except Exception as e:
        print(f"An error occurred while reading the directory: {e}")
        return []

def write_to_file(script_lines, output_file):
    try:
        with open(output_file, 'w') as f:
            for line in script_lines:
                f.write(line + '\n')
        print(f'Script tags have been written to {output_file}')
    except Exception as e:
        print(f"An error occurred while writing to the file: {e}")


# Set the directory where the .js files are located
directory = '.'  # Update this with your actual folder path if needed

# Output file to store the generated script lines
output_file = 'script_tags.html'

# Generate the script tags and write them to the file
script_tags = generate_script_tags(directory)
write_to_file(script_tags, output_file)
