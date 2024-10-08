/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core');
const main = require('../src/main');

// Mock the GitHub Actions core library
// const debugMock = jest.spyOn(core, 'debug').mockImplementation();
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation();
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation();
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation();

// Mock the action's main function
const runMock = jest.spyOn(main, 'run');

// Other utilities
// const timeRegex = /^\d{2}:\d{2}:\d{2}/;

describe('action', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('sets the time output', async () => {
        // Set the action's inputs as return values from core.getInput()
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'sapi':
                    return 'cli,fpm';
                default:
                    return '';
            }
        });

        await main.run();
        expect(runMock).toHaveReturned();
        expect(setOutputMock).toHaveBeenNthCalledWith(1, 'sapi', 'cli,fpm');
    });

    it('sets the wrong sapi name', async () => {
        // Set the action's inputs as return values from core.getInput()
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'sapi':
                    return 'foo';
                default:
                    return '';
            }
        });

        await main.run();
        expect(runMock).toHaveReturned();
        expect(setFailedMock).toHaveBeenNthCalledWith(1, 'Invalid sapi');
    });

    it('fails if no input is provided', async () => {
        // Set the action's inputs as return values from core.getInput()
        getInputMock.mockImplementation(name => {
            switch (name) {
                case 'sapi':
                    return 'cl';
                case 'php-version':
                    return '8.2';
                case 'extensions':
                    return 'mbstring';
                default:
                    return '';
            }
        });

        await main.run();
        expect(runMock).toHaveReturned();

        // Verify that all the core library functions were called correctly
        expect(setFailedMock).toHaveBeenNthCalledWith(1, 'Invalid sapi');
    });

    it.each`
        sapi             | output
        ${'clvvi,micro'} | ${'Invalid sapi: clvvi'}
        ${'micro,clhhi'} | ${'Invalid sapi: clhhi'}
        ${'mieecro'}     | ${'Invalid sapi: mieecro'}
    `(
        'tests the action with sapi=$sapi, php_version=$php_version, and extensions=$extensions',
        async ({ sapi, output }) => {
            // Set the action's inputs as return values from core.getInput()
            getInputMock.mockImplementation(name => {
                switch (name) {
                    case 'sapi':
                        return sapi;
                    default:
                        return '';
                }
            });

            await main.run();
            expect(setFailedMock).toHaveBeenNthCalledWith(1, output);
        }
    );
});
