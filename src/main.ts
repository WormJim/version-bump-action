import * as core from '@actions/core';
import * as github from '@actions/github';
import * as Webhooks from '@octokit/webhooks';
import context from './context';
import helpers from './utils';

async function run(): Promise<void> {
  try {
    const { token, pathToPackage } = await context.getInputs();

    if (github.context.eventName === 'push') {
      const pushPayload = github.context.payload;
      core.info(`The head commit is: ${pushPayload.head}`);
    }

    // const kit = github.getOctokit(token);

    if (pathToPackage !== '.') {
      process.chdir(pathToPackage);
      core.info(`Using ${pathToPackage} as working directory...`);
    }

    const currentVersion = helpers.getPackage(pathToPackage).version;

    // Get last commit of current ref.
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
