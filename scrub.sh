{ node scrub.js; git add $(find . -size +0c); git commit -m "Automatic image upload."; git push; } > "$(date +"%Y-%m-%d_%H-%M").log" 2>&1 &
{ node website/generate.js; git add $(find . -size +0c); git commit -m "Automatic website update."; git push; }
