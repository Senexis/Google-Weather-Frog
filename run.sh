NOW=$(date +"%F")
cd ~/Google-Weather-Frog
{ node app.js && git add $(find . -size +0c) && git commit -m "Automatic image upload." && git push; } >$NOW.log 2>&1