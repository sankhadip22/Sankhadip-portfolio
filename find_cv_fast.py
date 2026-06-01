import os

dirs_to_search = [
    r"C:\Users\sankh\.gemini\antigravity\scratch",
    r"C:\Users\sankh\.gemini\antigravity\brain\2e579c86-4581-4451-b359-400320937a81"
]
output_path = r"C:\Users\sankh\.gemini\antigravity\scratch\sankhadip-portfolio\found_files_fast.txt"

found = []
for start_dir in dirs_to_search:
    if os.path.exists(start_dir):
        for root, dirs, files in os.walk(start_dir):
            for file in files:
                file_lower = file.lower()
                if "cv" in file_lower or "resume" in file_lower or file_lower.endswith(".pdf") or file_lower.endswith(".docx"):
                    found.append(os.path.join(root, file))

with open(output_path, "w", encoding="utf-8") as f:
    for item in found:
        f.write(item + "\n")

print(f"Found {len(found)} files")
