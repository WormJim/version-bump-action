import * as path from 'path';
import * as fs from 'fs';

export const getPackage = (workspace: string): { version: string } => {
  const pathToPackage = path.resolve(workspace, 'package.json');
  if (!fs.existsSync(pathToPackage)) throw new Error("package.json could not be found in your project's root.");
  return require(pathToPackage);
};

const npmBump = async () => {};

export const bumpGitHubPackage = async () => {};

export const commitBump = async () => {};

export default {
  getPackage,
  bumpGitHubPackage,
  npmBump,
};
