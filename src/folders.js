const fs = require('fs');
const path = require('path');

class Folders {
    /**
     * 
     * @param {string} source 
     * @param {boolean} verbose 
     */
    constructor(source, verbose) {
        this.source = source;
        this.verbose = verbose;
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
    
    /**
     * 
     * @param {array} filenames 
     */
    filterFilenames(filenames) {
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

    /**
     * 
     * @param {array} directories 
     */
    filterDirectoriesWithIndex(directories) {
        return new Promise((resolve, reject) => {
            const folders = [];
            directories.forEach((dir, index) => {
                fs.access(path.resolve(this.source, dir, 'index.js'), fs.constants.R_OK, err => {
                    if (err && this.verbose) {
                        console.info(`Ignoring ${this.source}${path.sep}${dir} as an index.js does not exist`);
                    } else {
                        folders.push(dir);
                    }
                    
                    if (index === directories.length - 1) {
                        resolve(folders);
                    }
                });
            });
        });
    }

    get() {
        return this.readDirectory()
            .then(this.filterFilenames.bind(this))
            .then(this.filterDirectoriesWithIndex.bind(this));
    }
}

module.exports = Folders;