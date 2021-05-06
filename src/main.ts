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

    // Guard against unwanted branch pushs.
    if (inputs.ref) {
      const { stdout: branch } = await exec('git', ['branch', '--show-current']);
      if (branch !== inputs.ref?.split('/').pop()) {
        core.info('Current Ref does not match desired branch');
        return;
      }
    }

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
    const npmVersion = await exec('npm', ['version', '--allow-same-version=true', `--git-tag-version=${inputs.tag}`, kit.bumpVersion]);
    // if(npmVersion.stderr) throw npmVersion.stderr;
    if (npmVersion.success) core.info(`Bumped Runner Package version: from ${pkgVersion} to ${npmVersion.stdout.slice(1)}`);

    // Set up git config for user name and user email

    // Commit the version bump on package.json
    const commited = await exec('git', ['commit', '-a', '-m', inputs.commitMessage.replace(/{{version}}/g, npmVersion.stdout)]);
    if (commited.success) {
      core.info(`Successful commit: "${inputs.commitMessage.replace(/{{version}}/g, npmVersion.stdout)}" to branch ${inputs.ref.toUpperCase()}`);
    }

    // Push Commit Up To Remote Server
    const remoteRepo = `https://${process.env.GITHUB_ACTOR}:${inputs.token}@github.com/${process.env.GITHUB_ACTOR}/${process.env.GITHUB_REPOSITORY}.git`;

    const push = await exec('git', ['push', remoteRepo]);
    if (push.success) {
      core.info(`Successful pushed commit "${inputs.commitMessage.replace(/{{version}}/g, npmVersion.stdout)}" to branch ${inputs.ref.toUpperCase()}`);
    }

    // Push Tag if Tag True
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
