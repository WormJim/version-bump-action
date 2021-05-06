import * as path from 'path';
import * as fs from 'fs';

export const getPackage = async (workspace: string): Promise<{ version: string }> => {
  const pathToPackage = path.join(workspace, 'package.json');
  if (!fs.existsSync(pathToPackage)) throw new Error(`${pathToPackage} could not be found in your project's root.`);
  return await require(pathToPackage);
};

const npmBump = async () => {};

export const bumpGitHubPackage = async () => {};

export const commitBump = async () => {};

export default {
  getPackage,
  bumpGitHubPackage,
  npmBump,
};
