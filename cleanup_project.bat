@echo off
echo Deleting unused files...
del /Q "public\banner.png"
del /Q "public\hero-banner.png"
del /Q "node-v24.13.0-x64.msi"
del /Q "install_tools.bat"
del /Q "node.exe"
del /Q "npm"
del /Q "npm.cmd"
del /Q "npm.ps1"
del /Q "npx"
del /Q "npx.cmd"
del /Q "npx.ps1"
del /Q "corepack"
del /Q "corepack.cmd"
del /Q "nodevars.bat"
rd /S /Q "Git"
echo Cleanup complete.
pause
