import * as core from '@actions/core';
import context from './context';
import helpers from './utils';

async function run(): Promise<void> {
  try {
    const { pathToPackage } = await context.getInputs();

    if (pathToPackage !== '.') process.chdir(pathToPackage);
    core.info(`Using ${pathToPackage} as working directory...`);

    console.log(process.env.GITHUB_EVENT_PATH ? require(process.env.GITHUB_EVENT_PATH) : {});

    const currentVersion = helpers.getPackage(pathToPackage).version;

    // Get last commit of current ref.
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
