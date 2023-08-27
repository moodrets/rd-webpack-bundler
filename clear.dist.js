const path = require('node:path');
const fs = require('node:fs/promises');

(async function(){
    try {
        await fs.rm(path.resolve(__dirname, 'dist'), {recursive: true})
    } catch (error) {

    }
})()