@echo off
cd /d "%~dp0"
where python >nul 2>nul || (echo Python bulunamadi. index.html dosyasini acabilirsiniz, ancak PWA testleri icin HTTPS/localhost gerekir.& pause & exit /b 1)
start "" http://127.0.0.1:8080
python -m http.server 8080
