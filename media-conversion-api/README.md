# media-conversion-api

This project was created using `bun init` in bun v1.2.15. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Setup

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Endpoints

### Health Check

```bash
curl http://localhost:5000/health
```

### Video ➡ Audio

```bash
curl -X POST http://localhost:5000/video-to-audio \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Video ➡ Text

```bash
curl -X POST http://localhost:5000/video-to-text \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Check Job Status

```bash
curl http://localhost:5000/job/progress/:job_Id
```

### Download Audio

```bash
curl -O http://localhost:5000/audio/<filename>.mp3
```

### Download Text

```bash
curl -O http://localhost:5000/text/<filename>.txt
```
