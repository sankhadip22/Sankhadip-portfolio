import shutil
import os
import sys

src = r"C:\Users\sankh\.gemini\antigravity\brain\2e579c86-4581-4451-b359-400320937a81\media__1780293699600.jpg"
dst = r"C:\Users\sankh\.gemini\antigravity\scratch\sankhadip-portfolio\Sankhadip_Maity_CV.jpg"
log_path = r"C:\Users\sankh\.gemini\antigravity\scratch\sankhadip-portfolio\copy_log.txt"

def log(msg):
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(msg + "\n")
    print(msg)

log("Starting copy_cv.py...")
log(f"Python executable: {sys.executable}")
log(f"Python version: {sys.version}")

try:
    if os.path.exists(src):
        shutil.copy(src, dst)
        log(f"SUCCESS: Copied to {dst}")
        log(f"Destination exists check: {os.path.exists(dst)}")
    else:
        log(f"ERROR: Source file does not exist: {src}")
except Exception as e:
    log(f"EXCEPTION: {str(e)}")
