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
    major: ['BREAKING CHANGE', 'major'],
    minor: ['feature', 'minor'],
    patch: [''],
  };

  // Independant Inputs
  const token = coreInput('token', true);
  const commitMessage = coreInput('commit_message');
  const pathToPackage = coreInput('path_to_package');
  const tag = /true/i.test(coreInput('tag'));

  // Dependant Inputs
  const bumpInput = coreInput('bump');
  const bump = /false/i.test(boolConvert(bumpInput)) ? false : bumpInput;

  const majorInput = coreInput('major');
  const major = (majorInput.length && [...defaults.major, ...majorInput.split(',')]) || defaults.major;

  const minorInput = coreInput('minor');
  const minor = (minorInput.length && [...defaults.minor, ...minorInput.split(',')]) || defaults.minor;

  const patchInput = coreInput('patch');
  const patch = (patchInput.length && [...defaults.patch, ...patchInput.split(',')]) || undefined;

  const ref = coreInput('ref').split('/').pop();

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
