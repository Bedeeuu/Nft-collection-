import os
import json
import time
import aiohttp
import logging
import asyncio
from uuid import uuid4
from base64 import b64encode, b64decode

from aiogram import Bot, Dispatcher, types, F
from aiogram.enums import ParseMode
from aiogram.client.bot import DefaultBotProperties
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.filters import Command
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)

# ─── ENV ───────────────────────────────────────────────
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
GITHUB_TOKEN   = os.getenv("MY_TOKEN")
GITHUB_REPO    = os.getenv("MY_REPO")
BRANCH         = os.getenv("GITHUB_BRANCH", "main")
IMG_DIR        = os.getenv("GITHUB_PATH_IMG", "images")
DESC_DIR       = os.getenv("GITHUB_PATH_DESC", "description")
HF_TOKEN       = os.getenv("HF_TOKEN")
NFT_STORAGE_KEY = os.getenv("NFT_STORAGE_KEY")

# ─── INIT ──────────────────────────────────────────────
bot = Bot(token=TELEGRAM_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher(storage=MemoryStorage())
user_cache = {}  # user_id: {"image": ..., "base": ..., "ext": ...}

HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}
# ─── GitHub upload ─────────────────────────────────────
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

# ─── Wait for JSON ─────────────────────────────────────
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
                    return json.loads(b64decode(content).decode("utf-8"))
    return None

# ─── HuggingFace call ─────────────────────────────────
async def ask_vlm(image_url: str, question: str) -> str:
    payload = [{
        "role": "user",
        "content": [
            {"type": "image", "url": image_url},
            {"type": "text", "text": question}
        ]
    }]
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    async with aiohttp.ClientSession() as session:
        async with session.post("https://api-inference.huggingface.co/models/HuggingFaceTB/SmolVLM-Instruct", headers=headers, json=payload) as resp:
            if resp.status == 200:
                result = await resp.json()
                return result[0]["generated_text"]
            return f"[Error {resp.status}] {await resp.text()}"

# ─── Command: /start ──────────────────────────────────
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="📤 Загрузить изображение", switch_inline_query_current_chat="")],
        [InlineKeyboardButton(text="🌐 Описание по ссылке", switch_inline_query_current_chat="/caption ")],
        [InlineKeyboardButton(text="🪙 Минт NFT", callback_data="mint_info")]
    ])

    await message.answer(
        "👋 Добро пожаловать!\n\n"
        "📸 Отправь мне изображение — и я создам описание через AI.\n\n"
        "🧠 Можешь также:\n"
        "• Задать вопрос → /ask [вопрос]\n"
        "• Повторить описание → /rebuild\n"
        "• Сгенерировать по ссылке → /caption <url>\n"
        "• Минт в IPFS → /mint\n",
        reply_markup=keyboard
    )


# ─── Command: /ask ────────────────────────────────────
@dp.message(Command("ask"))
async def cmd_ask(message: types.Message):
    q = message.text.replace("/ask", "").strip()
    if message.from_user.id not in user_cache:
        return await message.answer("⚠️ Сначала отправь изображение.")
    if not q:
        return await message.answer("✍️ Добавь вопрос после /ask.")
    img_url = user_cache[message.from_user.id]["image"]
    reply = await ask_vlm(img_url, q)
    await message.answer(f"🤖 <b>Ответ:</b>\n{reply}")

# ─── Command: /caption <url> ──────────────────────────
@dp.message(Command("caption"))
async def cmd_caption(message: types.Message):
    url = message.text.replace("/caption", "").strip()
    if not url:
        return await message.answer("⚠️ Укажи ссылку: /caption https://...")

    q = "Опиши это изображение подробно, включая эмоциональный тон."
    reply = await ask_vlm(url, q)
    await message.answer(f"🧠 Описание:\n{reply}")

# ─── Command: /rebuild ────────────────────────────────
@dp.message(Command("rebuild"))
async def cmd_rebuild(message: types.Message):
    uid = message.from_user.id
    if uid not in user_cache:
        return await message.answer("⚠️ Нет предыдущего изображения.")
    url = user_cache[uid]["image"]
    q = "Сгенерируй новое поэтичное описание изображения."
    result = await ask_vlm(url, q)
    await message.answer(f"🔁 Новое описание:\n{result}")

# ─── Command: /mint ───────────────────────────────────
@dp.message(Command("mint"))
async def cmd_mint(message: types.Message):
    uid = message.from_user.id
    if uid not in user_cache:
        return await message.answer("⚠️ Сначала отправь изображение.")

    name = user_cache[uid]["base"]
    ext  = user_cache[uid]["ext"]
    json_path = f"description/{name}.json"
    img_path = f"images/{name}{ext}"

    async def read_file_raw(path):
        url = f"https://raw.githubusercontent.com/{GITHUB_REPO}/main/{path}"
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as resp:
                return await resp.read()

    json_bytes = await read_file_raw(json_path)
    img_bytes  = await read_file_raw(img_path)

    async with aiohttp.ClientSession() as session:
        for content, filename in [(img_bytes, f"{name}{ext}"), (json_bytes, f"{name}.json")]:
            form = aiohttp.FormData()
            form.add_field("file", content, filename=filename, content_type="application/octet-stream")
            async with session.post("https://api.nft.storage/upload", data=form, headers={
                "Authorization": f"Bearer {NFT_STORAGE_KEY}"
            }) as resp:
                if resp.status == 200:
                    r = await resp.json()
                    cid = r['value']['cid']
                    await message.answer(f"🪙 Файл {filename} загружен: https://ipfs.io/ipfs/{cid}")
                else:
                    await message.answer(f"❌ Ошибка загрузки {filename}: {resp.status}")

# ─── MEDIA HANDLER (фото) ─────────────────────────────
@dp.message(F.photo | F.document)
async def handle_photo(message: types.Message):
    file = message.photo[-1] if message.photo else message.document
    info = await bot.get_file(file.file_id)
    ext = os.path.splitext(info.file_path)[1] or ".jpg"
    base_name = f"NFT_{uuid4().hex[:8]}"
    filename = f"{base_name}{ext}"
    path = f"temp/{filename}"
    await bot.download_file(info.file_path, path)
    raw = open(path, "rb").read()

    uploaded = await upload_to_github(filename, raw, f"{IMG_DIR}/{filename}")
    if not uploaded:
        return await message.answer("❌ Ошибка загрузки в GitHub.")

    await message.answer("📤 Жду описание...")
    data = await wait_for_json(message.from_user.id, base_name)
    if not data:
        return await message.answer("⚠️ Не удалось получить описание.")

    user_cache[message.from_user.id] = {
        "image": data["image"],
        "base": base_name,
        "ext": ext
    }

    await message.answer(f"✅ <b>{data['name']}</b>\n🧠 {data['description']}\n\n💬 Можешь задать вопрос: /ask [вопрос]")

# ─── MAIN ─────────────────────────────────────────────
if __name__ == "__main__":
    os.makedirs("temp", exist_ok=True)
    asyncio.run(dp.start_polling(bot))
