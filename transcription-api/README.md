# transcription-api

This project was created using `uv init` via [uv](https://docs.astral.sh/uv/getting-started/installation/) is an extremely fast Python package and project manager, written in Rust.

## Setup

To install dependencies:

```bash
uv sync
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
curl --location 'http://localhost:6000/transcribe' \
--data '{
    "job_id": "<job_id>",
    "filename": "<filename>.mp3"
}'
```

### Check Status

```bash
curl --location --request GET 'http://localhost:6000/transcribe/status/:job_id'
```
