#!/bin/bash
# Portfolio Frontend Development Server
# Starts the Vite dev server on port 5173

set -e

cd /home/administrator/Projects/portfolio/portfolio-public

PID_FILE="/tmp/portfolio-public.pid"
PORT=5173

# Kill any existing process from PID file
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    echo "Found existing Frontend process: $OLD_PID"
    if ps -p $OLD_PID > /dev/null 2>&1; then
        echo "Killing process tree for PID $OLD_PID..."
        # Kill the entire process tree
        pkill -9 -P $OLD_PID 2>/dev/null || true
        kill -9 $OLD_PID 2>/dev/null || true
    fi
    rm -f "$PID_FILE"
fi

# Kill ALL processes LISTENING on port (aggressive cleanup)
echo "Ensuring port $PORT is free..."
PORT_FREED=false
for i in {1..10}; do
    # Use sudo lsof to reliably detect listening processes
    PIDS=$(sudo lsof -ti:$PORT -sTCP:LISTEN 2>/dev/null || true)
    if [ -z "$PIDS" ]; then
        echo "Port $PORT is free"
        PORT_FREED=true
        break
    fi
    echo "Attempt $i: Killing listening processes on port $PORT: $PIDS"
    for PID in $PIDS; do
        # Kill children first
        pkill -9 -P $PID 2>/dev/null || true
        # Then kill the main process
        sudo kill -9 $PID 2>/dev/null || true
    done
    sleep 1
done

# Verify port is actually free
if [ "$PORT_FREED" = false ]; then
    echo "ERROR: Could not free port $PORT after 10 attempts"
    sudo lsof -i:$PORT -sTCP:LISTEN
    exit 1
fi

# Extra wait to ensure port is fully released by OS
sleep 1

echo "Starting Portfolio Frontend on port $PORT..."
npm run dev > /tmp/portfolio-public.log 2>&1 &
NEW_PID=$!
echo $NEW_PID > "$PID_FILE"
echo "Started Frontend server with PID: $NEW_PID"
echo "Logs: tail -f /tmp/portfolio-public.log"
