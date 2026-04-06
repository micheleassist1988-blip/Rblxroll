#!/bin/bash
# Kill any leftover processes on port 3000
fuser -k 3000/tcp 2>/dev/null || true

# Create MongoDB data directory
mkdir -p /home/runner/data/db

# Start MongoDB only if not already running
if ! pgrep -x mongod > /dev/null; then
  mongod --dbpath /home/runner/data/db --logpath /home/runner/data/mongod.log --fork --bind_ip 127.0.0.1
fi

cd rblxroll-backend-main && node index.js
