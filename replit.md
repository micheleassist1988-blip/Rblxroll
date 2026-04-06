# RblxRoll

A Roblox-themed gambling/rewards platform with various casino games.

## Architecture

- **Frontend**: Vue.js 2.x app (`rblxroll-frontend-main/`) — served on port 5000
- **Backend**: Node.js + Express API (`rblxroll-backend-main/`) — served on port 3000
- **Database**: MongoDB (local instance, data stored in `/home/runner/data/db`)
- **Real-time**: Socket.io for live game updates

## Features

Games: Case Battles, Crash, Roll, Dice Duels, Blackjack, Mines, Towers, Upgrader  
Systems: Cashier (crypto, Robux, Steam), Affiliates, Leaderboard, Chat, Rain

## Running the Project

Two workflows are configured:
1. **Start application** — Frontend Vue dev server on port 5000
2. **Backend** — Starts MongoDB and Node.js API on port 3000

## Key Files

- `rblxroll-backend-main/config/config.env` — Backend environment variables (DO NOT COMMIT)
- `rblxroll-frontend-main/.env.development` — Frontend environment variables
- `rblxroll-frontend-main/vue.config.js` — Vue CLI dev server config (allows all hosts for Replit)
- `start-backend.sh` — Script to start MongoDB then backend

## Environment Variables

Backend requires many env vars in `config/config.env`:
- `DATABASE_URI` — MongoDB connection string
- `SERVER_PORT` — Backend port (3000)
- `SERVER_FRONTEND_URL` — Frontend URL for CORS
- `TOKEN_SECRET` — JWT signing secret
- API keys for: CoinPayments, Skinify, Webshare, Zebrasmarket
- OAuth: Discord, Google
- SMTP email settings
- Game limits (min/max amounts for each game)

Frontend uses:
- `VUE_APP_BACKEND_URL` — Backend API URL
- `VUE_APP_SOCKET_URL` — WebSocket URL
- `VUE_APP_HCAPTCHA_KEY` — HCaptcha site key

## Notes

- The config.env file contains placeholder values — update with real API keys for full functionality
- MongoDB stores data locally; ensure `/home/runner/data/db` directory exists
- Backend errors on startup about game settings are non-critical (populated on first run)
