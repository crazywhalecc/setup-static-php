const core = require('@actions/core');

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        const ms = core.getInput('sapi', { required: true });
        // only accepts cli,fpm,micro,embed for now
        if (!['cli', 'fpm', 'micro', 'embed'].includes(ms)) {
            core.setFailed('Invalid sapi');
        }

        core.setOutput('sapi', ms);
        core.debug(`Sapi: ${ms}`);
    } catch (error) {
        // Fail the workflow run if an error occurs
        core.setFailed(error.message);
    }
}

module.exports = {
    run,
};
