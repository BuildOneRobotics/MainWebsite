@echo off
echo Syncing Build One website to GitHub and Vercel...
git add .
git commit -m "Auto-sync: %date% %time%"
git push origin main
echo Sync complete! Vercel will auto-deploy in ~30 seconds.