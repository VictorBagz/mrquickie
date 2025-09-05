# Mr Quickie Website Setup Script
# PowerShell version for better error handling and cross-platform compatibility

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Mr Quickie Website Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command($command) {
    try {
        if (Get-Command $command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Check if Node.js is installed
if (-not (Test-Command "node")) {
    Write-Host "❌ ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
if (-not (Test-Command "npm")) {
    Write-Host "❌ ERROR: npm is not installed!" -ForegroundColor Red
    Write-Host "Please install npm (usually comes with Node.js)" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Node.js and npm are installed" -ForegroundColor Green
Write-Host ""

# Display versions
Write-Host "Current versions:" -ForegroundColor Cyan
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "Node.js: $nodeVersion" -ForegroundColor White
Write-Host "npm: $npmVersion" -ForegroundColor White
Write-Host ""

# Check Node.js version (minimum v16)
$nodeVersionNumber = [version]($nodeVersion -replace 'v', '')
$minVersion = [version]"16.0.0"

if ($nodeVersionNumber -lt $minVersion) {
    Write-Host "⚠️  WARNING: Node.js version is below recommended minimum (v16.0.0)" -ForegroundColor Yellow
    Write-Host "Current version: $nodeVersion" -ForegroundColor Yellow
    Write-Host "Please consider upgrading Node.js for better compatibility." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Installing dependencies..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

# Install npm dependencies with error handling
try {
    & npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed with exit code $LASTEXITCODE"
    }
}
catch {
    Write-Host ""
    Write-Host "❌ ERROR: Failed to install dependencies!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Please check your internet connection and try again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Troubleshooting steps:" -ForegroundColor Cyan
    Write-Host "1. Check your internet connection" -ForegroundColor White
    Write-Host "2. Clear npm cache: npm cache clean --force" -ForegroundColor White
    Write-Host "3. Delete node_modules folder and try again" -ForegroundColor White
    Write-Host "4. Try using: npm install --verbose" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Create dist directory if it doesn't exist
if (-not (Test-Path "dist")) {
    New-Item -ItemType Directory -Name "dist" | Out-Null
    Write-Host "✅ Created dist directory" -ForegroundColor Green
}

# Create images directory if it doesn't exist
if (-not (Test-Path "images")) {
    New-Item -ItemType Directory -Name "images" | Out-Null
    Write-Host "✅ Created images directory" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    Setup Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Available Scripts:" -ForegroundColor Cyan
Write-Host ""

Write-Host "Development:" -ForegroundColor Yellow
Write-Host "  npm run dev          # Start development server" -ForegroundColor White
Write-Host "  npm start            # Alias for npm run dev" -ForegroundColor White
Write-Host "  npm run serve        # Alternative server on port 8080" -ForegroundColor White
Write-Host ""

Write-Host "Building:" -ForegroundColor Yellow
Write-Host "  npm run build        # Build for production" -ForegroundColor White
Write-Host "  npm run clean        # Clean build directory" -ForegroundColor White
Write-Host ""

Write-Host "Code Quality:" -ForegroundColor Yellow
Write-Host "  npm run format       # Format all files" -ForegroundColor White
Write-Host "  npm run lint-js      # Lint JavaScript" -ForegroundColor White
Write-Host "  npm run lint-css     # Lint CSS" -ForegroundColor White
Write-Host "  npm run fix-js       # Auto-fix JavaScript issues" -ForegroundColor White
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "2. Open browser to:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Green
Write-Host ""

Write-Host "For VS Code users:" -ForegroundColor Cyan
Write-Host "1. Open this folder in VS Code" -ForegroundColor White
Write-Host "2. Install recommended extensions when prompted" -ForegroundColor White
Write-Host "3. Use Ctrl+Shift+P -> 'Live Server: Open with Live Server'" -ForegroundColor White
Write-Host "4. Use F5 to start debugging" -ForegroundColor White
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "- Read README.md for detailed instructions" -ForegroundColor White
Write-Host "- Check .vscode/settings.json for editor configuration" -ForegroundColor White
Write-Host "- Review package.json for all available scripts" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green

# Ask if user wants to start development server
$startDev = Read-Host "Would you like to start the development server now? (y/n)"
if ($startDev -eq "y" -or $startDev -eq "Y" -or $startDev -eq "yes") {
    Write-Host ""
    Write-Host "Starting development server..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    & npm run dev
}
else {
    Write-Host ""
    Write-Host "Setup complete! Run 'npm run dev' when you're ready to start." -ForegroundColor Green
    Read-Host "Press Enter to exit"
}
