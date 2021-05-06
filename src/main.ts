import * as path from 'path';
import * as core from '@actions/core';
import context from './context';
import { git, npm } from './exec';
import { getPackage } from './utils';
import Versioned from './Version.class';

async function run(): Promise<void> {
  core.info('Initializing Version Bump');

  try {
    // Get Inputs and Initialize
    const inputs = await context.getInputs();
    const kit = new Versioned(inputs);

    // Guard against unwanted branch pushs.
    const branch = await git(['branch', '--show-current']);
    if (branch !== inputs.ref) {
      throw new Error(`${inputs.ref} does not match ${branch}`);
    }

    core.info(`Head Commit is: "${kit.headCommit}"`);
    if (kit.headIsBump) {
      // If this actions version bump commit activates a workflow
      // which calls this action again with the original action bump commit message
      // Ex ci: Bump version to v1.0.1
      // ignore the bump
      core.info('Head commit is a bump commit. No bump required!');
      return;
    }

    if (!kit.bumpVersion) {
      core.info('No version matches in Head Commit. Skipping verison bump!');
      return;
    }

    core.info(`Version type to bump: ${kit.bumpVersion.toUpperCase()}`);

    if (inputs.pathToPackage !== '.') {
      core.info(`Current Working Directory is ${process.cwd()}`);
      process.chdir(inputs.pathToPackage);
      core.info(`Updated Working Directory is ${process.cwd()}`);
      core.info(`Using ${inputs.pathToPackage} as working directory...`);
    }

    // Resolve Current Release Version From Package Json
    // const pkgVersion = (await getPackage(inputs.pathToPackage)).version.toString();
    // console.log(`core.getInput('path-to-package')`, core.getInput('path-to-package'));
    console.log('Resolved Path: ', path.join(inputs.pathToPackage, 'package.json'));
    const { version: pkgVersion } = await import(path.join(inputs.pathToPackage, 'package.json'));
    core.info(`Current Version is: ${pkgVersion}`);

    // Bump Runner Package Json
    const version = await npm(['version', '--allow-same-version=false', `--git-tag-version=${inputs.tag}`, kit.bumpVersion]);
    core.info(`Bumped Runner Package version: from ${pkgVersion} to ${version.slice(1)}`);
    core.setOutput('version', version);

    //TODO: Set up git config for user name and user email

    // Commit the version bump on package.json
    await git(['commit', '-a', '-m', inputs.commitMessage.replace(/{{version}}/g, version)]);
    core.info(`Successful commit: "${inputs.commitMessage.replace(/{{version}}/g, version)}" to branch ${inputs.ref.toUpperCase()}`);

    // Push Commit Up To Remote Server
    const remoteRepo = `https://${process.env.GITHUB_ACTOR}:${inputs.token}@github.com/${process.env.GITHUB_REPOSITORY}.git`;

    await git(['push', '--follow-tags', remoteRepo]);
    core.info(`Successful push: "${inputs.commitMessage.replace(/{{version}}/g, version)}" to branch ${inputs.ref.toUpperCase()}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
