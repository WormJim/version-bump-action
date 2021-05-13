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

const persist = (per: boolean, def: string[]) => {
  return (per && def) || [];
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
  const per = /true/i.test(coreInput('persist_phrase'));

  // Dependant Inputs
  const bumpInput = coreInput('bump');
  const bump = /false/i.test(boolConvert(bumpInput)) ? false : bumpInput;

  const majorInput = coreInput('major');
  const major = [...persist(per, defaults.major), ...majorInput.split(',')];

  const minorInput = coreInput('minor');
  const minor = [...persist(per, defaults.minor), ...minorInput.split(',')];

  const patchInput = coreInput('patch');
  const patch = [...persist(per, defaults.patch), ...patchInput.split(',')];

  const ref = coreInput('ref').split('/').pop()!;

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
