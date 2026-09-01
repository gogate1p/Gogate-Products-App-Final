$ErrorActionPreference = "Stop"

$patch = Split-Path -Parent $MyInvocation.MyCommand.Path
$project = "D:\gpfinal"

Write-Host "Installing GP Logistics Portal Suite..." -ForegroundColor Cyan

Copy-Item "$patch\frontend\src\*" "$project\frontend\src\" -Recurse -Force

New-Item -ItemType Directory -Force "$project\backend\src\integrations\pidge" | Out-Null
Copy-Item "$patch\backend\src\integrations\pidge\*" "$project\backend\src\integrations\pidge\" -Force

Copy-Item "$patch\backend\.env.pidge.example" "$project\backend\.env.pidge.example" -Force

Write-Host ""
Write-Host "Frontend portal files copied." -ForegroundColor Green
Write-Host "Pidge backend module copied." -ForegroundColor Green
Write-Host ""
Write-Host "NEXT MANUAL STEP:" -ForegroundColor Yellow
Write-Host "Import PidgeModule in backend/src/app.module.ts and add it to imports." -ForegroundColor White
Write-Host ""
Write-Host "Then configure exact Pidge values from your account/docs in backend environment:" -ForegroundColor Yellow
Get-Content "$project\backend\.env.pidge.example"

Write-Host ""
Write-Host "Build frontend:" -ForegroundColor Cyan
Write-Host "cd D:\gpfinal\frontend; npm.cmd run build" -ForegroundColor White