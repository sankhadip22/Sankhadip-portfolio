with open("style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

out = []
for idx, line in enumerate(lines):
    if "resume" in line.lower() or "cv" in line.lower():
        out.append(f"Line {idx+1}: {line.strip()}")

with open("search_css_output.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out) + "\n")
