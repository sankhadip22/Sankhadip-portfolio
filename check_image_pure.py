import os
import struct

def get_image_info(filepath):
    """Analyses a JPEG image file and returns its width and height."""
    with open(filepath, 'rb') as f:
        # Check if it's a JPEG
        data = f.read(2)
        if data != b'\xff\xd8':
            return "Not a valid JPEG file"
        
        while True:
            marker, = struct.unpack('>H', f.read(2))
            if marker == 0xffd9: # EOI (End of Image)
                break
            
            # Read segment length
            length, = struct.unpack('>H', f.read(2))
            
            if 0xffc0 <= marker <= 0xffc3: # SOF0 - SOF3 (Start of Frame)
                # Read frame info
                # Precision: 1 byte
                # Height: 2 bytes
                # Width: 2 bytes
                f.read(1)
                height, width = struct.unpack('>HH', f.read(4))
                return f"{width}x{height}"
            
            # Skip segment data
            f.read(length - 2)
            
    return "Could not find SOF marker"

image_path = r"C:\Users\sankh\.gemini\antigravity\scratch\sankhadip-portfolio\avatar.jpg"
output_path = r"C:\Users\sankh\.gemini\antigravity\scratch\sankhadip-portfolio\dimensions.txt"

try:
    if os.path.exists(image_path):
        res = get_image_info(image_path)
        with open(output_path, "w") as f:
            f.write(res + "\n")
    else:
        with open(output_path, "w") as f:
            f.write("Image not found\n")
except Exception as e:
    with open(output_path, "w") as f:
        f.write(f"Error: {str(e)}\n")
