@echo off
:: Configura la codificación de caracteres a UTF-8 para evitar caracteres extraños en los textos
chcp 65001 > nul
title Net-Inventory - Consola de Inicio Rápido

echo =====================================================================
echo           NET-INVENTORY - INICIADOR AUTOMÁTICO DE SERVIDORES
echo =====================================================================
echo.

:: 1. Iniciar la base de datos MariaDB
echo [1/3] Levantando servidor MariaDB en segundo plano...
:: Verificamos si ya está escuchando en el puerto 3306
netstat -ano | findstr :3306 > nul
if %errorlevel% equ 0 (
    echo [OK] ¡La base de datos MariaDB ya está activa en el puerto 3306!
) else (
    :: Iniciamos MariaDB en segundo plano sin bloquear la consola
    start "Servidor MariaDB" /B "C:\Program Files\MariaDB 12.2\bin\mariadbd.exe" --defaults-file="C:\Program Files\MariaDB 12.2\data\my.ini"
    echo Esperando a que el servidor inicialice...
    timeout /t 3 /nobreak > nul
    echo [OK] Servidor MariaDB iniciado.
)
echo.

:: 2. Iniciar el Backend (.NET)
echo [2/3] Levantando servidor API Backend (.NET 10.0)...
cd backend
start "Net-Inventory - Backend API" cmd /k "dotnet run"
cd ..
echo [OK] Iniciando backend en segundo plano (puerto http://localhost:5219).
echo.

:: 3. Iniciar el Frontend (Vite + React)
echo [3/3] Levantando servidor Frontend (Vite + React)...
cd frontend
start "Net-Inventory - Frontend App" cmd /k "npm run dev"
cd ..
echo [OK] Iniciando frontend en segundo plano (usualmente http://localhost:5173).
echo.

echo =====================================================================
echo ¡TODO LISTO!
echo.
echo - La base de datos está activa.
echo - HeidiSQL ya puede conectarse con las credenciales normales (root/root).
echo - El servidor y cliente se abrirán en dos ventanas independientes.
echo =====================================================================
echo.
pause
