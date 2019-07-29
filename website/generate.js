const fs = require('fs-extra')
const handlebars = require('handlebars');

handlebars.registerHelper('frogType', function (passedString) {
    var theString = passedString.substring(0, 2);
    return new handlebars.SafeString(theString)
});

let images = {};
let styles = [];

fs.readdir('../images/square/')
    .then(files => {
        files.forEach(file => {
            if (file.startsWith('.gitkeep')) return;

            var base = file.replace('_bg', '').replace('_mg', '').replace('_fg', '');
            var name = base.replace('.png', '').replace(/-/g, ' ');

            if (!images[name]) {
                images[name] = [];
            }

            if (!images[name].includes(base)) {
                images[name].push(base);
            }

            images[name].push(file);
        });
    })
    .then(() => {
        fs.readdir('../css/')
            .then(files => {
                files.forEach(file => {
                    if (file.startsWith('.gitkeep')) return;
                    styles.push(file);
                });
            })
    })
    .then(() => {
        return fs.readFile('template.handlebars.html', 'utf-8')
    })
    .then(source => {
        let template = handlebars.compile(source);

        let result = template({
            styles: styles,
            images: images
        });

        return result;
    })
    .then(page => {
        return fs.writeFile('../index.html', page)
    })
    .catch(error => console.error(error));
