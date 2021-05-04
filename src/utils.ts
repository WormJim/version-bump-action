import path from 'path';
import fs from 'fs';

export const getPackage = (workspace: string): { version: string } => {
  const pathToPackage = path.join(workspace, 'package.json');
  if (!fs.existsSync(pathToPackage)) throw new Error("package.json could not be found in your project's root.");
  return require(pathToPackage);
};

export const messagesSome = (words: string[], regex?: RegExp) => {
  return (cb: (...args: string[]) => unknown) => {
    // messages.some
    [].some((message: string) => {
      if (regex) return regex.test(message);
      return words.some((word) => {
        if (cb) return cb(word);
        return message.includes(word);
      });
    });
  };
};

export default {
  getPackage,
  messagesSome,
};
