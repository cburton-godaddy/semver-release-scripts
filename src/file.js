class File {
    constructor(path, version, options) {
        const source = {};
        source['path'] = require(path);
        this.version = version;
        this.versionMigration = new source['path'](options);

        ['up', 'down'].forEach(method => {
            if (!(method in this.versionMigration)) {
                throw new Error(`${method} does not exist in ${path}`);
            }
        });
    }

    setup(step, method, results) {
        if (!step in this.versionMigration || typeof this.versionMigration[step] !== 'function') {
            return Promise.resolve();
        }

        return this.versionMigration[step](this.version, method, results);
    }

    up() {
        return this.setup('before', 'up').then(() => {
            return this.versionMigration.up();
        }).then(results => {
            return this.setup('after', 'up', results);
        });
    }

    down() {
        return this.setup('before', 'down').then(() => {
            return this.versionMigration.down();
        }).then(results => {
            return this.setup('after', 'down', results);
        });
    }
}

module.exports = File;