@echo off
echo 🔍 Checking port 3000...
echo.

netstat -ano | findstr :3000
if %errorlevel%==0 (
    echo.
    echo ⚠️  Port 3000 is in use!
    echo.
    echo Processes using port 3000:
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        echo PID: %%a
        tasklist /fi "pid eq %%a" /fo table
    )
    echo.
    echo Would you like to kill these processes? (Y/N)
    set /p choice="> "
    if /i "%choice%"=="Y" (
        echo.
        echo Killing processes on port 3000...
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
            echo Killing PID %%a...
            taskkill /F /PID %%a >nul 2>&1
        )
        echo ✅ Port 3000 should be free now
    ) else (
        echo Port 3000 remains occupied
    )
) else (
    echo ✅ Port 3000 is free
)

echo.
echo Press any key to continue...
pause >nul
