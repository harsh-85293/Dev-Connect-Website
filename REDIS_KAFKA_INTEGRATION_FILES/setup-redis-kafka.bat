@echo off
REM DevConnect Redis and Kafka Setup Script for Windows
REM This script helps set up Redis and Kafka for the DevConnect project

echo 🚀 DevConnect Redis and Kafka Setup
echo ====================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo    Visit: https://docs.docker.com/desktop/windows/install/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    echo    Visit: https://docs.docker.com/compose/install/
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Create .env file if it doesn't exist
if not exist "BACKEND\.env" (
    echo 📝 Creating .env file from template...
    copy "BACKEND\env.example" "BACKEND\.env"
    echo ✅ .env file created. Please edit BACKEND\.env with your configuration.
) else (
    echo ✅ .env file already exists
)

REM Start Redis and Kafka services
echo 🐳 Starting Redis and Kafka services...
docker-compose -f docker-compose.dev.yml up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check Redis connection
echo 🔍 Testing Redis connection...
docker exec devconnect-redis redis-cli ping | findstr "PONG" >nul
if %errorlevel% equ 0 (
    echo ✅ Redis is running and accessible
) else (
    echo ❌ Redis connection failed
    pause
    exit /b 1
)

REM Check Kafka connection
echo 🔍 Testing Kafka connection...
docker exec devconnect-kafka kafka-broker-api-versions --bootstrap-server localhost:9092 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Kafka is running and accessible
) else (
    echo ❌ Kafka connection failed
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd BACKEND
call npm install
if %errorlevel% equ 0 (
    echo ✅ Backend dependencies installed
) else (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Services running:
echo    - Redis: localhost:6379
echo    - Kafka: localhost:9092
echo    - Kafka UI: http://localhost:8080
echo    - Redis Commander: http://localhost:8081
echo.
echo 🚀 To start the DevConnect backend:
echo    cd BACKEND
echo    npm run dev
echo.
echo 🛑 To stop services:
echo    docker-compose -f docker-compose.dev.yml down
echo.
echo 📚 For more information, see BACKEND\README_Redis_Kafka_Integration.md
pause
