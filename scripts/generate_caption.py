import os
import json
from langdetect import detect
from transformers import pipeline
from PIL import Image

img_dir = "images"
out_dir = "metadata"

os.makedirs(out_dir, exist_ok=True)

pipe = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")

for file in os.listdir(img_dir):
    if file.lower().endswith((".png", ".jpg", ".jpeg")):
        image_path = os.path.join(img_dir, file)
        image = Image.open(image_path)
        result = pipe(image)[0]["generated_text"]

        lang = detect(result)
        name = "NFT Artwork"
        if lang == "ru":
            name = "Цифровое Искусство"
        elif lang == "en":
            name = "NFT Artwork"

        json_data = {
            "name": name,
            "description": result
        }

        out_file = os.path.join(out_dir, file.rsplit(".", 1)[0] + ".json")
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)