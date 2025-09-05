@echo off
echo ========================================
echo    Mr Quickie Website Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    echo Please install npm (usually comes with Node.js)
    pause
    exit /b 1
)

echo ✓ Node.js and npm are installed
echo.

REM Display Node and npm versions
echo Current versions:
node --version
npm --version
echo.

echo Installing dependencies...
echo This may take a few minutes...
echo.

REM Install npm dependencies
npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo ✓ Dependencies installed successfully!
echo.

REM Create dist directory if it doesn't exist
if not exist "dist" mkdir dist

echo ✓ Created dist directory
echo.

echo ========================================
echo    Setup Complete! 🎉
echo ========================================
echo.
echo To start development:
echo   npm run dev
echo.
echo To build for production:
echo   npm run build
echo.
echo To format code:
echo   npm run format
echo.
echo To lint code:
echo   npm run lint-js
echo   npm run lint-css
echo.
echo The development server will start on:
echo   http://localhost:3000
echo.
echo For VS Code users:
echo 1. Open this folder in VS Code
echo 2. Install recommended extensions when prompted
echo 3. Use F5 to start debugging
echo.
echo ========================================

pause
