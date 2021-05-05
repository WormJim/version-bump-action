import * as core from '@actions/core';
import context from './context';
import exec from './exec';
import { getPackage } from './utils';
import Versioned from './Version.class';

async function run(): Promise<void> {
  try {
    // Get Inputs and Initialize
    const inputs = await context.getInputs();
    const kit = new Versioned(inputs);

    core.info(`Head Commit is: "${kit.headCommit}"`);
    if (kit.headIsBump) {
      // If this actions version bump commit activates a workflow
      // which calls this action again with the original action bump commit message
      // Ex ci: Bump version to v1.0.1
      // ignore the bump
      core.info('No bump required!');
      return;
    }

    if (!kit.bumpVersion) {
      core.info('No version matches in Head Commit. Skipping verison bump!');
      return;
    }

    core.info(`Version type to bump: ${kit.bumpVersion.toUpperCase()}`);

    if (inputs.pathToPackage !== '.') {
      process.chdir(inputs.pathToPackage);
      core.info(`Using ${inputs.pathToPackage} as working directory...`);
    }

    // Resolve Current Release Version From Package Json
    const pkgVersion = getPackage(inputs.pathToPackage).version.toString();
    core.info(`Current Version is: ${pkgVersion}`);

    // Bump Runner Package Json
    const { success, stdout: runnerVersion } = await exec('npm', ['version', '--allow-same-version=true', '--git-tag-version=false', kit.bumpVersion]);
    if (success) core.info(`Bumped Runner Package version: from ${pkgVersion} to ${runnerVersion.slice(1)}`);

    // Set up git config for user name and user email
    // Commit to action the version bump on package.json
    // Commit to Repo the version bump on package.json
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
