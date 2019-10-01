const https = require("https");
const fs = require("fs");
const { performance } = require('perf_hooks');

const wideRegex = /(?<url>https:\/\/www\.gstatic\.com\/weather\/froggie\/l\/)(?<name>.*?)_2x(?<ext>\.png)/g;
const locationUrls = [
    ["https://www.google.com/search?q=weather+nieuwendijk", "nieuwendijk"],
]

const colorsRegex = /background:-webkit-linear-gradient\((?<colors>.*?)\)/g;

const androidUserAgent = {
    headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; A0001 Build/MHC19Q; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.80 Mobile Safari/537.36 GSA/10.28.7.21.arm"
    }
};

var nextIterationDelay = 0;
var iterationDelayAmount = 3000;

function getImages(url, regex, getColors = false) {
    return new Promise((resolve, reject) => {
        try {
            https.get(url, androidUserAgent, (response) => {
                if (response.statusCode !== 200) {
                    reject("Non-OK status code: " + response.statusCode);
                    return;
                }

                var body = "";

                response.on("data", function (chunk) {
                    body += chunk;
                });

                response.on("end", function () {
                    var images = [];

                    var match;
                    while (match = regex.exec(body)) {
                        var object = {
                            url: match[0],
                            name: match[2],
                            extension: match[3]
                        };

                        if (getColors) {
                            var color;
                            while (color = colorsRegex.exec(body)) {
                                object.css = color[0];
                                object.gradient = color[1];
                            }
                        }

                        images.push(object);
                    }

                    resolve(images);
                });
            }).on("error", (error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function downloadFile(url, path) {
    return new Promise((resolve, reject) => {
        try {
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

function makeFile(data, path) {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFile(path, data, (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        } catch (error) {
            reject(error);
        }
    })
}

async function doLocationsDownload() {
    locationUrls.forEach(async (item, index, array) => {
        nextIterationDelay = nextIterationDelay + iterationDelayAmount;

        setTimeout(async () => {
            const realIndex = (index + 1).toString();
            const padLength = array.length.toString().length;
            const currentItemString = "[L: " + realIndex.padStart(padLength, '0') + "/" + array.length + "]";
            const performanceString = "[" + Math.round(performance.now()) + " ms]";

            var result = await getImages(item[0], wideRegex, true).catch((error) => console.log(currentItemString, performanceString, "Item failed:", JSON.stringify(error)));

            if (result === undefined) {
                return;
            }

            if (result.length < 1) {
                console.log(currentItemString, performanceString, "Item failed, empty result:", item[0]);
                return;
            }

            result.forEach(async (image) => {
                console.log(currentItemString, performanceString, "Item:", image.name + image.extension)
                var css = ".weather-frog { background: linear-gradient(" + image.gradient + "); background: -moz-linear-gradient(" + image.gradient + "); background: -ms-linear-gradient(" + image.gradient + "); background: -o-linear-gradient(" + image.gradient + "); background: -webkit-linear-gradient(" + image.gradient + "); }";
                
                await makeFile(css, "./locations/" + item[1] + "/weather-frog.css");
                await downloadFile(image.url.replace("_2x.png", "_4x.png"), "./locations/" + item[1] + "/weather-frog" + image.extension).catch((error) => console.log(currentItemString, performanceString, "Item failed:", JSON.stringify(error)));
            });

            console.log(currentItemString, performanceString, "Item complete.");
        }, nextIterationDelay);
    });
}

console.log("=== [" + new Date().toString() + "] ===");
console.log("Totals: " + locationUrls.length + " location URL(s)");

doLocationsDownload().catch((error) => console.error(error));
