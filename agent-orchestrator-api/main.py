import os
import uvicorn
import ollama
import logging

from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware


logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # Ensure we have the proper headers on response
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.abspath(os.path.join(API_DIR, ".."))
TEXT_DIR = os.path.join(ROOT_DIR, "_text")
os.makedirs(TEXT_DIR, exist_ok=True)

# Select any model from Ollama: https://ollama.com/search
MODEL_NAME = "gemma3"
STREAM_BUFFER_SIZE = 120


class AgentRequest(BaseModel):
    filename: str
    message: str


def _stream_agent(prompt):
    logged = False
    buffer = ""
    try:
        for chunk in ollama.chat(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            stream=True,
        ):
            content = chunk.get("message", {}).get("content")
            if content:
                if not logged:
                    buffer += content
                    if "." in buffer or len(buffer) > STREAM_BUFFER_SIZE:
                        first_sentence = buffer.split(".", 1)[0] + "."
                        logger.info(
                            "[Agent response] %r",
                            first_sentence.strip(),
                        )
                        logged = True
                yield content
        if not logged and buffer:
            logger.info(
                "[Agent response] %r",
                buffer[:STREAM_BUFFER_SIZE].strip(),
            )
    except Exception:
        logger.exception("Agent error")
        yield "\n[Agent error]\n"


@app.post("/api/agent-stream")
def agent_stream(req: AgentRequest):
    filename = req.filename
    message = req.message
    context = ""
    if filename:
        # Sanitize the filename
        if "/" in filename or "\\" in filename or ".." in filename:
            raise HTTPException(status_code=400, detail="Invalid filename")
        filepath = os.path.join(TEXT_DIR, filename)
        if not os.path.isfile(filepath):
            raise HTTPException(status_code=404, detail="File not found")

        with open(filepath, "r", encoding="utf-8") as f:
            context = f.read()

    # Compose prompt: context (if any), then message (if given)
    if message:
        prompt = f"CONTEXT: {context} \n\n INSTRUCTIONS: PLEASE AVOID HALLUCINATING. IF YOU DO NOT KNOW THE ANSWER THEN SIMPLY SAY SO. PLEASE PROVIDE A BRIEF AND CONCISE ANSWER TO THE PROMPT THAT IS AS ACCURATE AS POSSIBLE: {message}"

    return StreamingResponse(_stream_agent(prompt), media_type="text/plain")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=3000, reload=False)
