import os
from PIL import Image

image_path = r"C:\Users\sankh\.gemini\antigravity\scratch\sankhadip-portfolio\avatar.jpg"
if os.path.exists(image_path):
    with Image.open(image_path) as img:
        print(f"Format: {img.format}")
        print(f"Size: {img.size}")
        print(f"Mode: {img.mode}")
else:
    print("File not found")
