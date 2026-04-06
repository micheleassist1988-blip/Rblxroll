#!/bin/bash
mkdir -p /home/runner/data/db

# Start MongoDB
if ! pgrep -x mongod > /dev/null; then
  mongod --dbpath /home/runner/data/db --logpath /home/runner/data/mongod.log --fork --bind_ip 127.0.0.1
fi

# Run backend in production mode (serves Vue frontend too)
cd rblxroll-backend-main
NODE_ENV=production SERVER_PORT=5000 node index.js
