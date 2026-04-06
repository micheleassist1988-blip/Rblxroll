#!/bin/bash
fuser -k 5000/tcp 2>/dev/null || true
cd rblxroll-frontend-main && npm run serve
