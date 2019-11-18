const mock = require('mock-fs');
const Folders = require('./../src/Folders.js');

const mockedFileSystem = () => {
    return {
        'migrations/1.11.0': {
            'index.js': 'abc'
        },
        'migrations/1.10.0': {},
        'migrations/1.3.2': {
            'index.js': 'def',
            'changesomething.js': 'somethingchanging'
        }
    };
};

describe('folders', () => {
    let spies = {};
    
    beforeEach(() => {
        spies.next = jest.fn();
    });

    afterEach(() => {
        mock.restore();
        jest.restoreAllMocks();
        spies = {};
    });

    test('only returns folders with index.js', () => {
        mock(mockedFileSystem());
        
        const folderClass = new Folders('', false);

        folderClass.filterDirectoriesWithIndex(['migrations/1.11.0', 'migrations/1.10.0', 'migrations/1.3.2']).then(dirs => expect(dirs).toEqual(['migrations/1.11.0', 'migrations/1.3.2']));
    });
});
