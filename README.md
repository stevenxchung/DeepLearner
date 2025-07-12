# DeepLearner 🧠

> **End-to-end multimedia-to-text AI companion — runs 💯 locally 👀.**  
> Convert **video → audio → text** for analysis, retrieval, and language model integration.

[![Python](https://img.shields.io/badge/python-3.12%2B-orange.svg)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/made%20with-TypeScript-blue)](https://www.typescriptlang.org/)
[![Runs Locally](https://img.shields.io/badge/runs-locally-green)]()

![Demo](./_assets/demo.gif)

## 🚀 Features

- 🎥 **Video to Audio** conversion via `FFmpeg` or `yt-dlp`
- 🔉 **Audio to Text** transcription with `faster-whisper` (GPU-accelerated)
- 🤖 **LLM Integration** with local models via [Ollama](https://ollama.com)
- 🧰 Built with [`uv`](https://docs.astral.sh/uv/getting-started/installation/) and [`Bun`](https://bun.sh), ultra-fast Python and JavaScript package managers
- 💻 Runs completely offline for maximum privacy and minimal cost (just your ⚡ bill 👀)

## 🏭 Architecture

```
[UI] ──▶ [Media Orchestrator API] ──▶ [Transcription API]
│
└──▶ [Agent Orchestrator API]
```

- **UI**: allows users to convert video into text and interact with an AI agent for summarization or deeper exploration of media content
- **Agent Orchestrator API**: wraps an Ollama SDK and an open-source model of choice and streams LLM-generated responses back to the client
- **Media Orchestrator API**: provides endpoints to convert and manage audio and text files derived from video. It also supports polling for real-time media conversion status updates
- **Transcription API**: transcribes audio to text and exposes an endpoint to check live transcription progress

## 🧱 Requirements

The following software needs to be installed on your local machine before running.

### 📦 Package Managers

We highly recommend the following:

- [**Bun**](https://bun.sh) – Fast JavaScript runtime & package manager
- [**uv**](https://docs.astral.sh/uv/getting-started/installation/) – Blazing fast Python environment manager (written in Rust)

### 🤖 Local LLMs

- [**Ollama**](https://ollama.com/download) – A streamlined, open-source platform for running and managing LLMs on your local machine. It simplifies downloading, setting up, and interacting with open-source models

> ℹ️ Make sure Ollama is running in the background for LLM-based workflows.

### 🎞️ Video to Audio Tools

- [**FFmpeg**](https://github.com/FFmpeg/FFmpeg) – A powerful multimedia toolkit for handling audio, video, subtitles, and metadata
- [**yt-dlp**](https://github.com/yt-dlp/yt-dlp) – A feature-rich CLI tool for downloading videos and audio from thousands of websites (a modern fork of youtube-dl)

### 🎙️ Audio to Text (Transcription)

To enable GPU-accelerated transcription with [`faster-whisper`](https://github.com/SYSTRAN/faster-whisper):

- NVIDIA GPU with sufficient VRAM for your chosen model
- NVIDIA GPU driver (version depends on your CUDA setup)
- [CUDA Toolkit](https://developer.nvidia.com/cuda-downloads) (typically version 11+)
- [cuDNN](https://developer.nvidia.com/cudnn-downloads) (sometimes bundled with CUDA)

To ensure PyTorch is installed with CUDA support:

```bash
# ./transcription-api
uv pip install torch --index-url https://download.pytorch.org/whl/cu128 && uv sync
```
