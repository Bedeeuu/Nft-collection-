import os
import json
import time
import aiohttp
import logging
import asyncio
from aiogram import Bot, Dispatcher, types, F
from aiogram.enums import ParseMode
from aiogram.client.bot import DefaultBotProperties
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.filters import Command
from dotenv import load_dotenv
from uuid import uuid4
from base64 import b64encode, b64decode

load_dotenv()
logging.basicConfig(level=logging.INFO)

# ─── ENV ───────────────────────────────────────────
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
GITHUB_TOKEN   = os.getenv("MY_TOKEN")
GITHUB_REPO    = os.getenv("MY_REPO")
BRANCH         = os.getenv("GITHUB_BRANCH", "main")
IMG_DIR        = os.getenv("GITHUB_PATH_IMG", "images")
DESC_DIR       = os.getenv("GITHUB_PATH_DESC", "description")
HF_TOKEN       = os.getenv("HF_TOKEN")  # 🔑 HuggingFace API token

HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}

# ─── INIT ──────────────────────────────────────────
bot = Bot(token=TELEGRAM_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher(storage=MemoryStorage())
user_cache = {}  # {user_id: {"image": ..., "base": ...}}

# ─── UPLOAD TO GITHUB ──────────────────────────────
async def upload_to_github(filename: str, data: bytes, path: str):
    url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{path}"
    payload = {
        "message": f"Upload {filename}",
        "content": b64encode(data).decode("utf-8"),
        "branch": BRANCH
    }
    async with aiohttp.ClientSession() as session:
        async with session.put(url, headers=HEADERS, json=payload) as resp:
            return resp.status in [201, 200]

# ─── WATCH FOR JSON ────────────────────────────────
async def wait_for_json(user_id: int, base_name: str, timeout=60):
    json_path = f"{DESC_DIR}/{base_name}.json"
    url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{json_path}?ref={BRANCH}"

    for _ in range(timeout // 3):
        await asyncio.sleep(3)
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=HEADERS) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    content = data["content"]
                    json_str = b64decode(content).decode("utf-8")
                    return json.loads(json_str)
    return None

# ─── START ─────────────────────────────────────────
@dp.message(Command("start"))
async def start(message: types.Message):
    await message.answer("👋 Отправь изображение, и я сгенерирую описание NFT через GitHub!\n💬 После можешь задать вопрос через /ask")

# ─── ASK ───────────────────────────────────────────
@dp.message(Command("ask"))
async def ask(message: types.Message):
    user_id = message.from_user.id
    if user_id not in user_cache:
        return await message.answer("⚠️ Сначала отправь изображение.")
    
    question = message.text.replace("/ask", "").strip()
    if not question:
        return await message.answer("✍️ Добавь вопрос после /ask.")
    
    image_url = user_cache[user_id]["image"]

    payload = [{
        "role": "user",
        "content": [
            {"type": "image", "url": image_url},
            {"type": "text", "text": question}
        ]
    }]

    hf_url = "https://api-inference.huggingface.co/models/HuggingFaceTB/SmolVLM-Instruct"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(hf_url, headers=headers, json=payload) as resp:
                if resp.status == 200:
                    result = await resp.json()
                    reply = result[0]["generated_text"]
                else:
                    text = await resp.text()
                    reply = f"❌ Ошибка HuggingFace: {resp.status}\n{text}"
    except Exception as e:
        reply = f"❌ Ошибка запроса: {e}"

    await message.answer(f"🤖 <b>Ответ:</b>\n{reply}")

# ─── IMAGE HANDLER ─────────────────────────────────
@dp.message(F.photo | F.document)
async def handle_photo(message: types.Message):
    file = message.photo[-1] if message.photo else message.document
    info = await bot.get_file(file.file_id)
    ext = os.path.splitext(info.file_path)[1] or ".jpg"
    base_name = f"NFT_{uuid4().hex[:8]}"
    filename = f"{base_name}{ext}"
    path = f"temp/{filename}"

    await bot.download_file(info.file_path, path)
    with open(path, "rb") as f:
        raw = f.read()

    success = await upload_to_github(filename, raw, f
