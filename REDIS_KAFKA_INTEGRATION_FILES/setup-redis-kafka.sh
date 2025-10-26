#!/bin/bash

# DevConnect Redis and Kafka Setup Script
# This script helps set up Redis and Kafka for the DevConnect project

echo "🚀 DevConnect Redis and Kafka Setup"
echo "===================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file if it doesn't exist
if [ ! -f "BACKEND/.env" ]; then
    echo "📝 Creating .env file from template..."
    cp BACKEND/env.example BACKEND/.env
    echo "✅ .env file created. Please edit BACKEND/.env with your configuration."
else
    echo "✅ .env file already exists"
fi

# Start Redis and Kafka services
echo "🐳 Starting Redis and Kafka services..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check Redis connection
echo "🔍 Testing Redis connection..."
if docker exec devconnect-redis redis-cli ping | grep -q "PONG"; then
    echo "✅ Redis is running and accessible"
else
    echo "❌ Redis connection failed"
    exit 1
fi

# Check Kafka connection
echo "🔍 Testing Kafka connection..."
if docker exec devconnect-kafka kafka-broker-api-versions --bootstrap-server localhost:9092 &> /dev/null; then
    echo "✅ Kafka is running and accessible"
else
    echo "❌ Kafka connection failed"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd BACKEND
if npm install; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Services running:"
echo "   - Redis: localhost:6379"
echo "   - Kafka: localhost:9092"
echo "   - Kafka UI: http://localhost:8080"
echo "   - Redis Commander: http://localhost:8081"
echo ""
echo "🚀 To start the DevConnect backend:"
echo "   cd BACKEND"
echo "   npm run dev"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose -f docker-compose.dev.yml down"
echo ""
echo "📚 For more information, see BACKEND/README_Redis_Kafka_Integration.md"
