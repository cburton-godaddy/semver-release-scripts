const fs = require('fs');
const path = require('path');
const semver = require('semver');

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
    
    /**
     * 
     * @returns {Promise}
     */
    readDirectory() {
        return new Promise((resolve, reject) => {
            fs.readdir(path.resolve(this.source), (err, filenames) => {
                if (err) {
                    reject(err);
                    return;
                }
    
                resolve(filenames);
            });
        });
    }
    
    /**
     * 
     * @param {array} filenames 
     * @returns {Promise}
     */
    filterFilenames(filenames) {
        const promises = filenames.map(file => {
            return new Promise((resolve, reject) => {
                fs.stat(path.resolve(this.source, file), (err, stats) => {
                    if (!semver.valid(file) || !stats.isDirectory()) {
                        if (this.verbose) {
                            console.info(`Ignoring ${this.source}${path.sep}${file} as it is not a valid semver`);
                        }

                        resolve();
                        return;
                    }

                    resolve(file);
                });
            });
        });

        return Promise.all(promises);
    }

    /**
     * 
     * @param {array} directories 
     * @returns {Promise}
     */
    filterDirectoriesWithIndex(directories) {
        const promises = directories.filter(Boolean).map(dir => {
            return new Promise((resolve, reject) => {
                fs.access(path.resolve(this.source, dir, 'index.js'), fs.constants.R_OK, err => {
                    if (err) {
                        if (this.verbose) {
                            console.info(`Ignoring ${this.source}${path.sep}${dir} as an index.js does not exist`);
                        }

                        resolve();
                        return;
                    }

                    resolve(dir);
                });
            });
        });

        return Promise.all(promises).then(dirs => Promise.resolve(dirs.filter(Boolean)));
    }

    /**
     * @returns {Promise}
     */
    get() {
        return this.readDirectory()
            .then(this.filterFilenames.bind(this))
            .then(this.filterDirectoriesWithIndex.bind(this));
    }
}

module.exports = Folders;