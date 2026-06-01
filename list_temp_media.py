import os
import glob

brain_dir = r"C:\Users\sankh\.gemini\antigravity\brain\2e579c86-4581-4451-b359-400320937a81"
output_path = r"C:\Users\sankh\.gemini\antigravity\scratch\sankhadip-portfolio\found_media.txt"

found_files = []

# Search brain directory
for root, dirs, files in os.walk(brain_dir):
    for file in files:
        if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            full_path = os.path.join(root, file)
            mtime = os.path.getmtime(full_path)
            found_files.append((full_path, mtime))

# Sort by modification time descending (most recent first)
found_files.sort(key=lambda x: x[1], reverse=True)

with open(output_path, "w", encoding="utf-8") as f:
    for path, mtime in found_files:
        f.write(f"{path} | {mtime}\n")

print(f"Listed {len(found_files)} media files")
