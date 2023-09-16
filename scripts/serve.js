const exec = require('child_process').exec;

const child = exec('node ./scripts/build.mjs; http-server ./dist -p 8082;',
    (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });


const fs = require('fs');

fs.watch("./pages", (eventType, filename) => {
    const pages = exec('node ./scripts/build.mjs',
    (error, stdout, stderr) => {
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });
});
    
fs.watch("./components", (eventType, filename) => {
    const components = exec('node ./scripts/build.mjs',
    (error, stdout, stderr) => {
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });
});
    
