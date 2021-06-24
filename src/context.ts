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

const persist = (per: boolean = false, def: string[]) => {
  return (per && def) || [];
};

const trim = (value: string) => value.trim();

const splitTrim = (value: string, del: string) => {
  return value?.split(del)?.map(trim) || [''];
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
  const bump = /false/i.test(boolConvert(coreInput('bump'))) ? false : coreInput('bump');
  const major = [...persist(per, defaults.major), ...splitTrim(coreInput('major'), ',')];
  const minor = [...persist(per, defaults.minor), ...splitTrim(coreInput('minor'), ',')];
  const patch = [...persist(per, defaults.patch), ...splitTrim(coreInput('patch'), ',')];
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
