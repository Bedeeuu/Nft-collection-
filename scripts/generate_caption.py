import os
import json
from transformers import pipeline
from PIL import Image

IMAGE_DIR = "images"
DESC_DIR = "description"
MODEL = "Salesforce/blip-image-captioning-base"

pipe = pipeline("image-to-text", model=MODEL)
os.makedirs(DESC_DIR, exist_ok=True)

for fname in os.listdir(IMAGE_DIR):
    if not fname.lower().endswith((".jpg", ".jpeg", ".png")):
        continue

    base = os.path.splitext(fname)[0]
    json_path = os.path.join(DESC_DIR, f"{base}.json")
    if os.path.exists(json_path):
        print(f"[SKIP] Already exists: {json_path}")
        continue

    try:
        img_path = os.path.join(IMAGE_DIR, fname)
        image = Image.open(img_path).convert("RGB")
        caption = pipe(image)[0]["generated_text"].strip()

        metadata = {
            "name": base,
            "description": caption,
            "image": f"https://raw.githubusercontent.com/${{GITHUB_REPOSITORY}}/main/images/{fname}"
        }

        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)

        print(f"[OK] Created: {json_path}")

    except Exception as e:
        print(f"[ERROR] Failed for {fname}: {e}")
