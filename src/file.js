class File {
    constructor(path, version) {
        const source = {};
        source['path'] = require(path);
        this.version = version;
        this.versionMigration = new source['path']();

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
        this.setup('before', 'up').then(() => {
            return this.versionMigration.up();
        }).then(results => {
            return this.setup('after', 'up', results);
        });
    }

    down() {
        this.setup('before', 'down').then(() => {
            return this.versionMigration.down();
        }).then(results => {
            return this.setup('after', 'down', results);
        });
    }
}

module.exports = File;