@echo off
echo 🎨 DevConnect Diagram Image Generator
echo ====================================

echo.
echo Checking for Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found. Please install Python first.
    pause
    exit /b 1
)

echo ✅ Python found
echo.

echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

echo Installing Mermaid CLI...
npm install -g @mermaid-js/mermaid-cli
if %errorlevel% neq 0 (
    echo ❌ Failed to install Mermaid CLI
    pause
    exit /b 1
)

echo ✅ Mermaid CLI installed
echo.

echo Generating diagram images...
python generate_diagram_images.py

echo.
echo 🎉 Image generation complete!
echo 📁 Check the 'images' folder for your generated diagrams.
echo 📄 Open 'images/index.html' to view all diagrams in a web browser.
echo.
pause


