import * as core from '@actions/core';

export interface Inputs {
  token: string;
  pathToPackage: string;
  commitMessage: string;
  tag: boolean;
}

export const getInputs = async (): Promise<Inputs> => {
  return {
    token: core.getInput('token', { required: true }),
    commitMessage: core.getInput('commit-message') || 'ci: Bump version to {{version}}',
    pathToPackage: core.getInput('path-to-package') || '.',
    tag: /true/i.test(core.getInput('tag')),
  };
};

export default {
  getInputs,
};
