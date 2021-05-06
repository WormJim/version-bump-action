import * as core from '@actions/core';

export interface Inputs {
  token: string;
  pathToPackage: string;
  commitMessage: string;
  tag: boolean;
  minor: string[];
  major: string[];
  patch: string[];
  ref: string;
}

export const getInputs = async (): Promise<Inputs> => {
  return {
    token: core.getInput('token', { required: true }),
    commitMessage: core.getInput('commit_message'),
    pathToPackage: core.getInput('path_to_package'),
    major: core.getInput('major').split(','),
    minor: core.getInput('minor').split(','),
    patch: core.getInput('patch').split(','),
    tag: /true/i.test(core.getInput('tag')),
    ref: core.getInput('ref')!.split('/')!.pop()!,
  };
};

export default {
  getInputs,
};
