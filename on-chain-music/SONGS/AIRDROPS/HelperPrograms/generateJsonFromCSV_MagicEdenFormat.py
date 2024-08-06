import csv
import json
import os

def generate_json_from_csv_files_in_directory(directory):
    csv_files = [f for f in os.listdir(directory) if f.endswith('.csv')]
    
    for csv_file in csv_files:
        print(f"Processing {csv_file}...")
        data = []
        with open(os.path.join(directory, csv_file), mode='r') as file:
            reader = csv.reader(file)
            next(reader)  # Skip the header if there is one

            for idx, row in enumerate(reader, start=1):
                if len(row) != 2:
                    print(f"Skipping row {idx} in {csv_file}: Expected 2 columns, got {len(row)}")
                    continue

                id_value, access_level = row
                try:
                    access_level = str(int(access_level))  # Ensure access level is a string
                except ValueError:
                    print(f"Skipping row {idx} in {csv_file}: Access level is not a valid integer")
                    continue

                nft_entry = {
                    "id": id_value,
                    "meta": {
                        "name": f"I Love Cheese #{idx}",
                        "attributes": [
                            {
                                "trait_type": "Access Level",
                                "value": access_level
                            }
                        ]
                    }
                }
                data.append(nft_entry)

        json_output = json.dumps(data, indent=4)
        json_filename = f"{os.path.splitext(csv_file)[0]}.json"
        with open(os.path.join(directory, json_filename), 'w') as json_file:
            json_file.write(json_output)

        print(f"JSON file '{json_filename}' created successfully.")

# Call the function with the current directory
generate_json_from_csv_files_in_directory('.')
