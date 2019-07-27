now=`date +"%m_%d_%Y"`
cd ~/Google-Weather-Frog
{ node app.js && git add $(find . -size +0c) && git commit -m "Automatic image upload." && git push; } >"log_$now.txt" 2>&1