import { Inputs } from './context';
import * as github from '@actions/github';

const commitWordMatch = (words: string[], regex?: RegExp) => {
  return (commit: string, cb?: (...args: string[]) => unknown) => {
    return (
      !words.length ||
      regex?.test(commit) ||
      words.some((word) => {
        if (cb) return cb(word);
        return commit.includes(word);
      })
    );
  };
};

interface Opts extends Inputs {}

export default class Versioned {
  private _bump: string | false;
  private _versionRegExp: RegExp = /v\d+\.\d+\.\d+/;
  private _versionNumsRegExp: RegExp = /\d+\.\d+\.\d+/;
  private _majorPhrases;
  private _minorPhrases;
  private _patchPhrases;
  private _headCommit;
  private _payload;

  // Public Vars
  public commitMessage: string;

  // Private Methods

  private _bumpVersion() {
    if (this.majorMatch()(this._headCommit)) return 'major';
    if (this.minorMatch()(this._headCommit)) return 'minor';
    if (this.patchMatch()(this._headCommit)) return 'patch';
    return false;
  }

  private _extractNum(version: string | false) {
    // If the version variable is FLASE, RegEx test will return false
    if (this._versionNumsRegExp.test(version as string)) {
      return (version as string).match(this._versionNumsRegExp)![0];
    }

    return false;
  }

  constructor({ commitMessage, major, minor, patch, bump }: Opts) {
    this.commitMessage = commitMessage;
    this._majorPhrases = major;
    this._minorPhrases = minor;
    this._patchPhrases = patch;

    const payload = github.context.payload || {};
    this._payload = payload;
    this._headCommit = payload?.head_commit.message || '';

    this._bump = this._extractNum(bump) || this._bumpVersion();
  }

  // Public Methods
  public majorMatch = () => commitWordMatch(this._majorPhrases, /^([a-zA-Z]+)(\(.+\))?(\!)\:/);
  public minorMatch = () => commitWordMatch(this._minorPhrases);
  public patchMatch = () => commitWordMatch(this._patchPhrases || []);

  // Accessor
  get headIsBump() {
    return this._versionRegExp.test(this._headCommit);
  }

  get bumpVersion() {
    return this._bump;
  }

  get headCommit() {
    return this._headCommit;
  }
}
