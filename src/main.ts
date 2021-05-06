import * as path from 'path';
import * as core from '@actions/core';
import context from './context';
import { getGitConfig, git, npm, setGitConfig } from './exec';
import { getPackage } from './utils';
import Versioned from './Version.class';
import * as fs from 'fs';

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

    if (inputs.pathToPackage !== process.cwd()) {
      core.info(`Current Working Directory is ${process.cwd()}`);
      process.chdir(inputs.pathToPackage);
      core.info(`Updated Working Directory is ${process.cwd()}`);
      core.info(`Using ${inputs.pathToPackage} as working directory...`);
    }

    // Resolve Current Release Version From Package Json
    const pkg = getPackage(inputs.pathToPackage);
    core.info(`Current Version is: ${pkg.version}`);

    // Bump Runner Package Json
    const version = await npm(['version', '--allow-same-version=false', `--git-tag-version=${inputs.tag}`, kit.bumpVersion]);
    core.info(`Bumped Runner Package version: from ${pkg.version} to ${version.slice(1)}`);
    core.setOutput('version', version);

    //TODO: Set up git config for user name and user email
    const userName = await getGitConfig('user.name');
    const userEmail = await getGitConfig('user.email');
    await setGitConfig('user.name', `"${userName || process.env.GITHUB_USER || 'CI: Automation Version Bump'}"`);
    await setGitConfig('user.email', `"${userEmail || process.env.GITHUB_EMAIL || 'bump-version@users.noreply.github.com'}"`);
    core.info(`Configuring Git for ${userName} <${userEmail}>`);

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
