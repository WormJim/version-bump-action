import * as actionsExec from '@actions/exec';
import { ExecOptions } from '@actions/exec';

export interface ExecResult {
  success: boolean;
  stdout: string;
  stderr: string;
}

const exec = async (command: string, args: string[] = [], silent: boolean = true): Promise<ExecResult> => {
  let stdout: string = '';
  let stderr: string = '';

  const options: ExecOptions = {
    silent: silent,
    ignoreReturnCode: true,
  };
  options.listeners = {
    stdout: (data: Buffer) => {
      stdout += data.toString();
    },
    stderr: (data: Buffer) => {
      stderr += data.toString();
    },
  };

  const returnCode: number = await actionsExec.exec(command, args, options);

  return {
    success: returnCode === 0,
    stdout: stdout.trim(),
    stderr: stderr.trim(),
  };
};

const command = (command: string) => {
  return async (args: string[] = []): Promise<string> => {
    return await exec(command, args).then((res) => {
      if (res.stderr !== '' && !res.success) {
        throw new Error(res.stderr);
      }
      return res.stdout.trim();
    });
  };
};

export const git = command('git');
export const npm = command('npm');

export default exec;
