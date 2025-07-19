import os, asyncio, aiohttp
from pathlib import Path

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL_IMG = "nlpconnect/vit-gpt2-image-captioning"
HF_MODEL_TEXT = os.getenv("HF_TEXT_MODEL", "tiiuae/falcon-7b-instruct")

async def get_basic(path):
    url = f"https://api-inference.huggingface.co/models/{HF_MODEL_IMG}"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    data = open(path, "rb").read()
    async with aiohttp.ClientSession() as s:
        async with s.post(url, headers=headers, data=data) as r:
            j = await r.json()
            return j[0]["generated_text"].strip() if isinstance(j, list) else ""

async def get_rich(text):
    url = f"https://api-inference.huggingface.co/models/{HF_MODEL_TEXT}"
    headers = {"Authorization": f"Bearer {HF_TOKEN}", "Content-Type": "application/json"}
    payload = {
        "inputs": f"Detail colors, objects, and mood: {text}",
        "parameters": {"max_new_tokens": 150, "temperature": 0.7},
        "options": {"wait_for_model": True}
    }
    async with aiohttp.ClientSession() as s:
        async with s.post(url, headers=headers, json=payload) as r:
            j = await r.json()
            if isinstance(j, list): return j[0].get("generated_text","").strip()
            if isinstance(j, dict): return j.get("generated_text","").strip()
            return str(j).strip()

async def main():
    folder = Path("images")
    for img in folder.glob("*.*"):
        txt = folder / f"{img.stem}.txt"
        if txt.exists(): continue
        basic = await get_basic(str(img))
        rich = await get_rich(basic) or basic
        txt.write_text(rich, encoding="utf-8")

asyncio.run(main())
