# Script to start the Piper TTS HTTP server
# Note: Ensure Python is in your PATH and piper-tts is installed

$voice = "en_US-lessac-medium"
$port = 5001

Write-Host "Starting Piper TTS Server on port $port using voice $voice..." -ForegroundColor Green

python -m piper.http_server -m $voice --port $port
