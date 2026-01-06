Write-Host "Starting CMS Frontend Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Backend API should be running at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location $PSScriptRoot
python -m http.server 8080

