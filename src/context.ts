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

  return {
    token: coreInput('token', true),
    commitMessage: coreInput('commit_message') || defaults.commitMessage,
    pathToPackage: coreInput('path_to_package') || defaults.pathToPackage,
    major: (coreInput('major').length && [...defaults.major, ...coreInput('major').split(',')]) || defaults.major,
    minor: (coreInput('minor').length && [...defaults.minor, ...coreInput('minor').split(',')]) || defaults.minor,
    patch: (coreInput('patch').length && [...defaults.patch, ...coreInput('patch').split(',')]) || undefined,
    tag: /true/i.test(coreInput('tag')),
    ref: coreInput('ref').split('/').pop() || defaults.ref,
    bump: /false/i.test(boolConvert(coreInput('bump'))) ? false : coreInput('bump'),
  };
};

export default {
  getInputs,
};
