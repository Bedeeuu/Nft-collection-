import os
import sys
import logging
import asyncio
import aiohttp
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, F
from aiogram.client.bot import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import Message
from aiogram.filters import Command
from github import Github, GithubException

load_dotenv()
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = os.getenv("GITHUB_REPO")
GITHUB_BRANCH = os.getenv("GITHUB_BRANCH", "main")
GITHUB_PATH = os.getenv("GITHUB_PATH", "images")
HF_TOKEN = os.getenv("HF_TOKEN")
HF_TEXT_MODEL = os.getenv("HF_TEXT_MODEL", "tiiuae/falcon-7b-instruct")
if not all([TELEGRAM_TOKEN, GITHUB_TOKEN, GITHUB_REPO, HF_TOKEN]):
    sys.exit(1)

logging.basicConfig(level=logging.INFO)

gh = Github(GITHUB_TOKEN)
repo = gh.get_repo(GITHUB_REPO)

bot = Bot(token=TELEGRAM_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher(storage=MemoryStorage())

async def get_basic_caption(path: str) -> str:
    url = "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    with open(path, "rb") as f:
        data = f.read()
    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, data=data) as resp:
            if resp.status == 200:
                result = await resp.json()
                return result[0].get("generated_text", "").strip()
    return ""

async def expand_description(text: str) -> str:
    url = f"https://api-inference.huggingface.co/models/{HF_TEXT_MODEL}"
    headers = {"Authorization": f"Bearer {HF_TOKEN}", "Content-Type": "application/json"}
    payload = {"inputs": f"Provide a rich description including colors, what is depicted, and the emotional tone: {text}"}
    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, json=payload) as resp:
            if resp.status == 200:
                data = await resp.json()
                # Some models return list of dicts, some plain string
                if isinstance(data, list) and data:
                    return data[0].get("generated_text", "").strip()
                if isinstance(data, dict) and data.get("generated_text"):
                    return data["generated_text"].strip()
                if isinstance(data, str):
                    return data.strip()
    return ""

async def get_caption_via_hf(path: str) -> str:
    basic = await get_basic_caption(path)
    if not basic:
        return ""
    rich = await expand_description(basic)
    return rich or basic


def github_upload_bytes(content: bytes, filename: str) -> str | None:
    path = f"{GITHUB_PATH}/{filename}"
    message = f"Add {filename}"
    try:
        repo.create_file(path, message, content, branch=GITHUB_BRANCH)
    except GithubException as e:
        if e.status == 409:
            existing = repo.get_contents(path, ref=GITHUB_BRANCH)
            repo.update_file(path, message, content, existing.sha, branch=GITHUB_BRANCH)
        else:
            return None
    return f"https://raw.githubusercontent.com/{GITHUB_REPO}/{GITHUB_BRANCH}/{path}"

@dp.message(Command("start"))
async def start_handler(message: Message) -> None:
    await message.answer("Send an image to generate a detailed description and upload to GitHub.")

@dp.message(F.photo | F.document)
async def handle_file(message: Message) -> None:
    file_obj = message.photo[-1] if message.photo else message.document
    file_info = await bot.get_file(file_obj.file_id)
    os.makedirs("temp", exist_ok=True)
    extension = os.path.splitext(file_info.file_path)[1] or ".jpg"
    local_path = f"temp/{file_obj.file_id}{extension}"

    # Download the file
    await bot.download_file(file_info.file_path, local_path)

    # Upload image to GitHub
    with open(local_path, "rb") as f:
        image_bytes = f.read()
    image_filename = f"img_{file_obj.file_id}{extension}"
    image_url = github_upload_bytes(image_bytes, image_filename)
    if not image_url:
        logging.error("Failed to upload image file to GitHub.")

    # Generate detailed caption via Hugging Face
    description = ""
    try:
        description = await get_caption_via_hf(local_path)
    except Exception as e:
        logging.error("Error generating description: %s", e)
    if not description:
        logging.warning("Description is empty; using basic caption or placeholder.")
        description = await get_basic_caption(local_path) or "No description available."

    # Upload description to GitHub
    content_bytes = description.encode("utf-8")
    desc_filename = f"desc_{file_obj.file_id}.txt"
    desc_url = github_upload_bytes(content_bytes, desc_filename)

    # Send back URLs
    response_lines = []
    if image_url:
        response_lines.append(f"Image URL: {image_url}")
    if desc_url:
        response_lines.append(f"Description URL: {desc_url}")
    if response_lines:
        await message.answer("\n".join(response_lines))
    else:
        await message.answer("Failed to upload image and description.")

if __name__ == "__main__":
    asyncio.run(dp.start_polling(bot))
