with open("style.css", "r", encoding="utf-8") as f:
    content = f.read()

open_braces = 0
close_braces = 0
errors = []

line_num = 1
col_num = 1

for i, char in enumerate(content):
    if char == '\n':
        line_num += 1
        col_num = 1
    else:
        col_num += 1
        
    if char == '{':
        open_braces += 1
    elif char == '}':
        close_braces += 1
        if close_braces > open_braces:
            errors.append(f"Unmatched closing brace '}}' at line {line_num}, col {col_num}")

if open_braces != close_braces:
    errors.append(f"Mismatch: {open_braces} open braces vs {close_braces} close braces!")
else:
    print("Braces match perfectly!")

if errors:
    print("Errors found:")
    for err in errors:
        print(err)
else:
    print("No brace syntax errors found!")
