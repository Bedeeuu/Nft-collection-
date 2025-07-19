import os
import json
from transformers import pipeline
from PIL import Image
from langdetect import detect

IMAGE_DIR = "images"
OUTPUT_DIR = "description"
MODEL = "Salesforce/blip-image-captioning-base"

os.makedirs(OUTPUT_DIR, exist_ok=True)
pipe = pipeline("image-to-text", model=MODEL)

for fname in os.listdir(IMAGE_DIR):
    if fname.lower().endswith((".png", ".jpg", ".jpeg")):
        base = os.path.splitext(fname)[0]
        out_path = os.path.join(OUTPUT_DIR, f"{base}.json")
        if os.path.exists(out_path):
            continue
        img = Image.open(os.path.join(IMAGE_DIR, fname)).convert("RGB")
        caption = pipe(img)[0]["generated_text"].strip()
        meta = {"name": base, "description": caption}
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)
        print(f"[OK] Generated metadata for {fname}")
