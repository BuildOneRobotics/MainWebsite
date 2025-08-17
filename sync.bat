@echo off
echo Syncing Build One website to GitHub...
git add .
git commit -m "Auto-sync: %date% %time%"
git push origin main
echo Sync complete!