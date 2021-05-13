import * as core from '@actions/core';

export interface Inputs {
  token: string;
  pathToPackage: string;
  commitMessage: string;
  tag: boolean;
  minor: string[];
  major: string[];
  patch: string[] | undefined;
  ref: string;
  bump: string | false;
}

const boolConvert = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch (error) {
    return value;
  }
};

const coreInput = (input: string, required: boolean = false) => {
  return core.getInput(input, { required });
};

export const getInputs = async (): Promise<Inputs> => {
  const defaults = {
    commitMessage: 'CI: Bump version to {{version}}',
    pathToPackage: process.env.GITHUB_WORKSPACE!,
    major: ['BREAKING CHANGE', 'major'],
    minor: ['feature', 'minor'],
    patch: [''],
    ref: 'main',
  };

  const token = coreInput('token', true);
  const commitMessage = coreInput('commit_message') || defaults.commitMessage;
  const pathToPackage = coreInput('path_to_package') || defaults.pathToPackage;
  const major = (coreInput('major').length && [...defaults.major, ...coreInput('major').split(',')]) || defaults.major;
  const minor = (coreInput('minor').length && [...defaults.minor, ...coreInput('minor').split(',')]) || defaults.minor;
  const patch = (coreInput('patch').length && [...defaults.patch, ...coreInput('patch').split(',')]) || undefined;
  const tag = /true/i.test(coreInput('tag'));
  const ref = coreInput('ref').split('/').pop() || defaults.ref;
  const bump = /false/i.test(boolConvert(coreInput('bump'))) ? false : coreInput('bump');

  return {
    token,
    commitMessage,
    pathToPackage,
    major,
    minor,
    patch,
    tag,
    ref,
    bump,
  };
};

export default {
  getInputs,
};
