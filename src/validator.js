const core = require('@actions/core');

async function validateInputs() {
    return new Promise(resolve => {
        // sapi, must be a valid PHP SAPI name, accepts cli,fpm,micro,embed
        const sapi = core.getInput('sapi', { required: true });
        core.debug(`SAPI: ${sapi}`);
        // split comma separated values
        const sapisArray = sapi.split(',').map(s => s.trim());
        // check if all values are valid, if some value is invalid, throw an error
        for (const s of sapisArray) {
            if (!['cli', 'fpm', 'micro', 'embed'].includes(s)) {
                throw new Error(`Invalid sapi: ${s}`);
            }
        }

        // php-version, must be a valid PHP version, accepts 8.0-8.3, and also patch versions, like 8.3.10
        const phpVersion = core.getInput('php-version', { required: false });
        core.debug(`PHP_VERSION: ${phpVersion}`);
        if (!phpVersion.match(/^8\.[0-3](\.\d+)?$/)) {
            throw new Error('Invalid php-version');
        }

        // extensions, comma separated list of PHP extensions
        const extensions = core.getInput('extensions', { required: false });
        if (!extensions.match(/^(\w+,)*\w+$/)) {
            throw new Error('Invalid extensions');
        }

        resolve();
    });
}

module.exports = { validateInputs };
