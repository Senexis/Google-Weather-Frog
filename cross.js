const https = require("https");
const fs = require("fs");
const { performance } = require('perf_hooks');

var nextIterationDelay = 0;
var iterationDelayAmount = 500;

const weatherTypes = [
    '01-sunny',
    '02-mostly-sunny',
    '03-partly-cloudy-day',
    '04-mostly-cloudy-day',
    '05-clear',
    '06-mostly-clear',
    '07-partly-cloudy-night',
    '08-mostly-cloudy-night',
    '09-cloudy',
    '10-drizzle',
    '11-rain',
    '12-heavy-rain',
    '13-flurries',
    '15-snow-showers-snow',
    '16-blowing-snow',
    '17-heavy-snow-blizzard',
    '19-mixed-rain-hail-rain-sleet',
    '20-rain-snow-wintry-mix',
    '22-iso-thunderstorms',
    '22-iso-thunderstorm',
    '24-strong-thunderstorms',
    '25-breezy-windy',
    '26-haze-fog-dust-smoke'
]

function downloadFile(url, path) {
    return new Promise((resolve, reject) => {
        try {
            if (fs.existsSync(path)) {
                if (fs.statSync(path).size > 0) {
                    resolve();
                    return;
                }
            }

            var file = fs.createWriteStream(path);

            https.get(url, (response) => {
                if (response.statusCode !== 200) {
                    file.end(() => {
                        fs.unlinkSync(path);
                    });

                    reject("Non-OK status code: " + response.statusCode);
                    return;
                }

                response.pipe(file);
                response.on('end', () => {
                    file.close(resolve);
                });
            }).on("error", (error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function doSyncTypes() {
    var images = fs.readdirSync('./images/wide');
    images.shift();

    images.forEach((file, index, array) => {
        var currentItem = array[index];
        currentItem = currentItem.replace('.png', '');
        
        weatherTypes.forEach((type) => {
            currentItem = currentItem.replace(type, '');
        });

        currentItem = currentItem.replace(/^-+|-+$/g, '');

        array[index] = currentItem;
    });

    var unique = [...new Set(images)];
    var compiledList = [];

    unique.forEach(image => {
        weatherTypes.forEach(type => {
            compiledList.push(type + '-' + image);
        });
    });

    compiledList.forEach(async (file, index, array) => {
        nextIterationDelay = nextIterationDelay + iterationDelayAmount;

        setTimeout(async () => {
            const realIndex = (index + 1).toString();
            const padLength = array.length.toString().length;
            const currentItemString = "[S: " + realIndex.padStart(padLength, '0') + "/" + array.length + "]";
            const performanceString = "[" + Math.round(performance.now()) + " ms]";

            var url = "https://www.gstatic.com/weather/froggie/l/" + file;

            await downloadFile(url + "_4x.png", "./images/wide/" + file + ".png").catch((error) => console.log(currentItemString, performanceString, "Item failed:", JSON.stringify(error)));

            console.log(currentItemString, performanceString, "Item complete.");
        }, nextIterationDelay);
    });
}

console.log("=== [" + new Date().toString() + "] ===");

doSyncTypes().catch((error) => console.error(error));
