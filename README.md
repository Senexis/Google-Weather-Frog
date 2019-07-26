# Google-Weather-Frog
To run `app.js` and automatically commit all changed, non-corrupt files, use the following command:
`node app.js && git add $(find . -size +0c) && git commit -m "Automatic image upload." && git push`