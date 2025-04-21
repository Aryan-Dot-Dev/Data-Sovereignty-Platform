@echo off
echo Setting up the Data Marketplace Frontend...

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo npm could not be found. Please install Node.js and npm first.
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
call npm install

REM Check if .env file exists, create from example if not
if not exist .env (
    echo .env file not found. Creating from .env.example...
    copy .env.example .env
    echo Please update the .env file with your own values, especially the Pinata JWT token.
)

echo Setup complete! You can now run the development server with:
echo npm run dev