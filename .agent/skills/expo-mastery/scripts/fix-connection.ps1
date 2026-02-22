# 🛠️ Expo Connection Reset Tool
# This script kills conflicting node processes and resets the ADB bridge

Write-Host "🚀 Starting Expo Environment Rescue..." -ForegroundColor Cyan

# 1. Kill Node processes
Write-Host "🛑 Terminating conflicting background processes..." -ForegroundColor Yellow
try {
    taskkill /F /IM node.exe /T /FI "STATUS eq RUNNING" 2>$null
} catch {
    Write-Host "✅ No conflicting Node processes found."
}

# 2. Reset ADB
Write-Host "🔄 Restarting ADB Bridge..." -ForegroundColor Yellow
adb kill-server
adb start-server

# 3. Clean Expo Cache
Write-Host "🧹 Cleaning local Expo caches..." -ForegroundColor Yellow
if (Test-Path ".expo") { Remove-Item -Recurse -Force ".expo" }

Write-Host "✨ Environment is now clean!" -ForegroundColor Green
Write-Host "👉 Run 'npx expo start --tunnel --clear' to start fresh." -ForegroundColor White
