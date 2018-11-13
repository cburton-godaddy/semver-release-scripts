const path = require('path');
const Folders = require('./folders');

class SemverReleaseScripts {
    /**
     * 
     * @param {object} config 
     */
    constructor(config) {
        this.source = config.source;
        this.verbose = config.verbose;
        this.folders = new Folders(this.source, this.verbose);
    }

    /**
     * 
     * @param {string} to 
     * @param {string} [from]
     */
    run(to, from) {
        this.folders.get()
            .then(folders => {
                const test = require(path.resolve(this.source, folders[0]));
                console.log(test);
            }).catch(err => {
                console.error(err);
            });
    }
};

module.exports = SemverReleaseScripts;