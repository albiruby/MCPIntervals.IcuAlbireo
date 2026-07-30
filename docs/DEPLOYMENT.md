# Deployment Guide - 100% Free Tier Deployment

TrackLab MCP requires **0 persistent database storage** and acts as an in-memory proxy & analysis engine.

## Option A: Railway (Free Tier)
1. Fork / push repo to GitHub.
2. Connect Railway to your repository.
3. Add Environment Variables:
   - `MCP_TRANSPORT=sse`
   - `INTERVALS_API_KEY=your_api_key`
   - `INTERVALS_ATHLETE_ID=i00000`
4. Railway will automatically detect `railway.json` and deploy.

## Option B: Render (Free Tier)
1. Select **New Web Service** on Render.
2. Connect your repository (`render.yaml` will auto-configure).
3. Set `INTERVALS_API_KEY` and `INTERVALS_ATHLETE_ID` in environment variables.

## Option C: Docker Local / VPS
```bash
docker-compose up -d --build
```
