NOW=$(date +"%F")
cd ~/Google-Weather-Frog
{ node sync.js; git add $(find . -size +0c); git commit -m "Automatic image sync upload."; git push; } >$NOW.log 2>&1
cd ./website
{ node generate.js; cd ..; git add $(find . -size +0c); git commit -m "Automatic website update."; git push; }
