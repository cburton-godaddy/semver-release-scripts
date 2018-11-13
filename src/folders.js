const fs = require('fs');
const path = require('path');

class Folders {
    constructor(source) {
        this.source = source;
    }

    readDirectory() {
        return new Promise((resolve, reject) => {
            fs.readdir(path.resolve(this.source), (err, filenames) => {
                if (err) {
                    reject(err);
                }
    
                resolve(filenames);
            });
        });
    }

    filterDirectories(filenames) {
        return new Promise((resolve, reject) => {
            const folders = [];
            filenames.forEach((file, index) => {
                fs.stat(path.resolve(this.source, file), (err, stats) => {
                    if (stats.isDirectory()) {
                        folders.push(file);
                    }

                    if (index === filenames.length - 1) {
                        resolve(folders);
                    }
                });
            });
        });
    }

    get() {
        return this.readDirectory().then(this.filterDirectories.bind(this));
    }
}

module.exports = Folders;