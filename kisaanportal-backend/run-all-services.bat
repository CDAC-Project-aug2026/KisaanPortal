@echo off
title AgriRent Backend Runner

echo ========================================
echo Starting AgriRent Microservices...
echo ========================================

:: Move to the folder where this BAT file is present
cd /d "%~dp0"

echo Starting Eureka Server...
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"

timeout /t 30 >nul

echo Starting API Gateway...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"

timeout /t 30 >nul

echo Starting Auth Service...
start "Auth Service" cmd /k "cd auth-service && mvn spring-boot:run"

echo Starting Equipment Service...
start "Equipment Service" cmd /k "cd equipment-service && mvn spring-boot:run"

echo Starting Booking Service...
start "Booking Service" cmd /k "cd booking-service && mvn spring-boot:run"

echo Starting Pricing Service...
start "Pricing Service" cmd /k "cd pricing-service && mvn spring-boot:run"

echo Starting Review Service...
start "Review Service" cmd /k "cd review-service && mvn spring-boot:run"

echo Starting Analytics Service...
start "Analytics Service" cmd /k "cd analytics-service && mvn spring-boot:run"

echo.
echo ========================================
echo All Services Started
echo ========================================
pause