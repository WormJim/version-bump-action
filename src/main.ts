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
      console.log('pushPayload', pushPayload);
      console.log('payload commits', pushPayload.commits);
      console.log('payload head_commits message', pushPayload.head_commits.message);
      core.info(`The head commit is: ${pushPayload.head_commits}`);
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
