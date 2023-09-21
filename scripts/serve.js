const exec = require('child_process').exec;

const child = exec('npm install; node ./scripts/build.mjs; http-server ./dist -p 8082;',
    (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });


const fs = require('fs');
let pagesTimeout = false
let componentsTimeout = false
let srcTimeout = false
fs.watch("./pages", { recursive: true }, (eventType, filename) => {
    console.log(`${filename} updated\nRegenerating...`)
    clearTimeout(pagesTimeout)
    pagesTimeout = setTimeout(() => {
        const pages = exec('node ./scripts/build.mjs',
            (error, stdout, stderr) => {
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
            });
    }, 200)
});

fs.watch("./components", { recursive: true }, (eventType, filename) => {
    console.log(`${filename} updated\nRegenerating...`)
    clearTimeout(componentsTimeout)
    componentsTimeout = setTimeout(() => {
        const components = exec('node ./scripts/build.mjs',
            (error, stdout, stderr) => {
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
            });
    }, 200)
});

fs.watch("./src", { recursive: true }, (eventType, filename) => {
    console.log(`${filename} updated\nRegenerating...`)
    clearTimeout(srcTimeout)
    srcTimeout = setTimeout(() => {
        const src = exec('node ./scripts/build.mjs',
            (error, stdout, stderr) => {
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
            });
    }, 200)
});


