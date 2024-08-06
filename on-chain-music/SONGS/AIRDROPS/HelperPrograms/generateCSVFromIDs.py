import csv

# Define the base part of the hash
base_hash = "4f6f53c59e8ed57b495f273a263b04d94c82c31f2172856959f39d6745000003i"

# Open a CSV file for writing
with open('hashes.csv', mode='w', newline='') as file:
    writer = csv.writer(file)
    
    # Write each hash to the CSV file
    for i in range(231):
        hash_value = f"{base_hash}{i}"
        writer.writerow([hash_value])

print("CSV file 'hashes.csv' created successfully.")
