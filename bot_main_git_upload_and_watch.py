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

load_dotenv()
logging.basicConfig(level=logging.INFO)

# ─── ENV ───────────────────────────────────────────
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
GITHUB_TOKEN   = os.getenv("MY_TOKEN")
GITHUB_REPO    = os.getenv("MY_REPO")
BRANCH         = os.getenv("GITHUB_BRANCH", "main")
IMG_DIR        = os.getenv("GITHUB_PATH_IMG", "images")
DESC_DIR       = os.getenv("GITHUB_PATH_DESC", "description")

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
    from base64 import b64encode
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
                    import base64
                    json_str = base64.b64decode(content).decode("utf-8")
                    return json.loads(json_str)
    return None

# ─── COMMANDS ──────────────────────────────────────
@dp.message(Command("start"))
async def start(message: types.Message):
    await message.answer("👋 Отправь изображение, и я сгенерирую описание NFT через GitHub!")

@dp.message(Command("ask"))
async def ask(message: types.Message):
    user_id = message.from_user.id
    if user_id not in user_cache:
        return await message.answer("⚠️ Нет загруженного изображения.")
    question = message.text.replace("/ask", "").strip()
    if not question:
        return await message.answer("✍️ Добавь вопрос после /ask.")
    img_url = user_cache[user_id]["image"]

    # вызов HuggingFace VLM через API (placeholder)
    await message.answer(f"🤖 (псевдоответ) AI думает над вопросом: «{question}» по изображению:\n{img_url}")

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

    success = await upload_to_github(filename, raw, f"{IMG_DIR}/{filename}")
    if not success:
        return await message.answer("❌ Не удалось загрузить изображение в GitHub.")

    await message.answer("📤 Загружено в GitHub. Жду описание...")

    data = await wait_for_json(message.from_user.id, base_name)
    if not data:
        return await message.answer("⚠️ Не удалось получить описание. Попробуй позж
