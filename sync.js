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

async function doSyncWides() {
    var squareImages = fs.readdirSync('./images/square');
    squareImages.shift();

    squareImages.forEach((file, index, array) => {
        array[index] = file.replace('_bg', '').replace('_mg', '').replace('_fg', '').replace('.png', '');
    });

    var uniqueSquareImages = [...new Set(squareImages)];

    uniqueSquareImages.forEach(async (file, index, array) => {
        nextIterationDelay = nextIterationDelay + iterationDelayAmount;

        setTimeout(async () => {
            const realIndex = (index + 1).toString();
            const padLength = array.length.toString().length;
            const currentItemString = "[S: " + realIndex.padStart(padLength, '0') + "/" + array.length + "]";
            const performanceString = "[" + Math.round(performance.now()) + " ms]";

            var url = "https://www.gstatic.com/weather/froggie/l/" + file;

            await downloadFile(url + "_4x.png", "./images/wide/" + file + ".png").catch((error) => console.log(currentItemString, performanceString, "Item failed:", JSON.stringify(error)));
            await downloadFile(url + "_c_4x.png", "./images/wide/" + file + "_c.png").catch((error) => console.log(currentItemString, performanceString, "Item failed:", JSON.stringify(error)));
            await downloadFile(url + "_f_4x.png", "./images/wide/" + file + "_f.png").catch((error) => console.log(currentItemString, performanceString, "Item failed:", JSON.stringify(error)));

            console.log(currentItemString, performanceString, "Item complete.");
        }, nextIterationDelay);
    });
}

async function doSyncSquares() {
    var wideImages = fs.readdirSync('./images/wide');
    wideImages.shift();

    wideImages.forEach((file, index, array) => {
        array[index] = file.replace('.png', '');
    })

    var uniqueWideImages = [...new Set(wideImages)];

    uniqueWideImages.forEach(async (file, index, array) => {
        nextIterationDelay = nextIterationDelay + iterationDelayAmount;

        setTimeout(async () => {
            const realIndex = (index + 1).toString();
            const padLength = array.length.toString().length;
            const currentItemString = "[W: " + realIndex.padStart(padLength, '0') + "/" + array.length + "]";
            const performanceString = "[" + Math.round(performance.now()) + " ms]";

            var url = "https://ssl.gstatic.com/onebox/weather/doodle/temp2/" + file;

            await downloadFile(url + "_bg.png", "./images/square/" + file + "_bg.png").catch((error) => console.log(currentItemString, performanceString, "Item failed:", JSON.stringify(error)));
            await downloadFile(url + "_fg.png", "./images/square/" + file + "_fg.png").catch((error) => console.log(currentItemString, performanceString, "Item failed:", JSON.stringify(error)));
            await downloadFile(url + "_mg.png", "./images/square/" + file + "_mg.png").catch((error) => console.log(currentItemString, performanceString, "Item failed:", JSON.stringify(error)));

            console.log(currentItemString, performanceString, "Item complete.");
        }, nextIterationDelay);
    })
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

doSyncWides().catch((error) => console.error(error));
doSyncSquares().catch((error) => console.error(error));

// Intensive (easily more than 1,000 images), only do once in a while.
// doSyncTypes().catch((error) => console.error(error));
