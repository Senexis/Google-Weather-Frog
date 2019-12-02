{ node cross.js; git add $(find . -size +0c); git commit -m "Automatic image upload."; git push; } > "logs/cross-$(date +"%Y-%m-%d_%H-%M").log" 2>&1
