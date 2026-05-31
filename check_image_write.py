import os
from PIL import Image

image_path = r"C:\Users\sankh\.gemini\antigravity\scratch\sankhadip-portfolio\avatar.jpg"
output_path = r"C:\Users\sankh\.gemini\antigravity\scratch\sankhadip-portfolio\dimensions.txt"

try:
    if os.path.exists(image_path):
        with Image.open(image_path) as img:
            with open(output_path, "w") as f:
                f.write(f"{img.width}x{img.height}\n")
        print("Success")
    else:
        with open(output_path, "w") as f:
            f.write("Image not found\n")
        print("Image not found")
except Exception as e:
    with open(output_path, "w") as f:
        f.write(f"Error: {str(e)}\n")
    print(f"Error: {e}")
