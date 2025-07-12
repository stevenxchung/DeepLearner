# transcription-api

This project was created using `uv init` via [uv](https://docs.astral.sh/uv/getting-started/installation/) is an extremely fast Python package and project manager, written in Rust.

## Setup

To install dependencies:

```bash
# To ensure PyTorch is GPU/CUDA-enabled
uv pip install torch --index-url https://download.pytorch.org/whl/cu128 && uv sync
```

To run:

```bash
[project.scripts]
uv run main.py
```

## Endpoints

### Health Check

```bash
curl http://localhost:5000/health
```

### Transcribe

```bash
curl --location 'http://localhost:6000/transcription' \
--data '{
    "job_id": "<job_id>",
    "filename": "<filename>.mp3"
}'
```

### Check Status

```bash
curl --location --request GET 'http://localhost:6000/transcription/status/:job_id'
```
