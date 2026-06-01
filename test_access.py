import os

paths = [
    r"C:\Users\sankh\.gemini\antigravity",
    r"C:\Users\sankh\.gemini\antigravity\brain",
    r"C:\Users\sankh\.gemini\antigravity\brain\2e579c86-4581-4451-b359-400320937a81"
]

out = []
for p in paths:
    exists = os.path.exists(p)
    readable = False
    if exists:
        try:
            os.listdir(p)
            readable = True
        except:
            pass
    out.append(f"Path: {p} | Exists: {exists} | Readable: {readable}")

with open("test_output.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out) + "\n")
