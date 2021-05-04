import * as core from '@actions/core';

export interface Inputs {
  pathToPackage: string;
  commitMessage: string;
  tag: boolean;
}

export const getInputs = async (): Promise<Inputs> => {
  return {
    commitMessage: core.getInput('commit-message') || 'ci: Bump version to {{version}}',
    pathToPackage: core.getInput('path-to-package') || '.',
    tag: /true/i.test(core.getInput('tag')),
  };
};

export default {
  getInputs,
};
