import * as path from 'path';
import * as fs from 'fs';

export const getPackage = (workspace: string): { version: string } => {
  return JSON.parse(fs.readFileSync(path.join(workspace, './package.json'), 'utf-8'));
};

const npmBump = async () => {};

export const bumpGitHubPackage = async () => {};

export const commitBump = async () => {};

export default {
  getPackage,
  bumpGitHubPackage,
  npmBump,
};
