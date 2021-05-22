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
  release: boolean;
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

const persist = (per: boolean = false, def: string[]) => {
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
  const release = /true/i.test(coreInput('release'));

  // Dependant Inputs
  const bump = /false/i.test(boolConvert(coreInput('bump'))) ? false : coreInput('bump');
  const major = [...persist(per, defaults.major), ...coreInput('major').split(',')];
  const minor = [...persist(per, defaults.minor), ...coreInput('minor').split(',')];
  const patch = [...persist(per, defaults.patch), ...coreInput('patch').split(',')];
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
    release,
  };
};

export default {
  getInputs,
};
