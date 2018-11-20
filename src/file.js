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

    setup(step) {
        if (!step in this.versionMigration || typeof this.versionMigration[step] !== 'function') {
            return Promise.resolve();
        }

        return this.versionMigration[step](this.version);
    }

    up() {
        this.setup('before').then(() => {
            return this.versionMigration.up();
        }).then(() => {
            return this.setup('after');
        });
    }

    down() {
        this.setup('before').then(() => {
            return this.versionMigration.down();
        }).then(() => {
            return this.setup('after');
        });
    }
}

module.exports = File;