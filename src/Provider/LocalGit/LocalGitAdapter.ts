import { VCSAdapter } from '../@interfaces/VCSAdapter';
import { Diff } from '../../Git/@types/PatchTypes';
import { Log } from '../../Logger';
import { IAnalyzerBot } from '../../AnalyzerBot/@interfaces/IAnalyzerBot';
import { SimpleGit } from 'simple-git';
import { configs } from '../../Config';
import { getPatch } from '../../Git/utils/patchProcessor';

export class LocalGitAdapter implements VCSAdapter {
  constructor(private readonly simpleGit: SimpleGit) {}

  async init(): Promise<void> {
    return;
  }

  async wrapUp(analyzer: IAnalyzerBot): Promise<boolean> {
    return analyzer.isSuccess();
  }

  getName(): string {
    return 'LocalGit';
  }

  getLatestCommitSha(): string {
    return 'HEAD';
  }

  async diff(): Promise<Diff[]> {
    const gitDiff = await this.simpleGit.diff([`${configs.localgitSourceBranch}...HEAD`]);
    console.log('gitDiff', gitDiff);
    const a = parseGitDiff(gitDiff);
    return getPatch(gitDiff);
  }
  createComment(comment: string): Promise<void> {
    // TODO: pretty print Markdown comment in console
    console.log('comment', comment);
    return Promise.resolve();
  }

  createReviewComment(text: string, file: string, line: number): Promise<void> {
    // TODO: pretty print Markdown comment in console
    console.log('review comment', `${text} ${file}:${line}`);
    return Promise.resolve();
  }

  async removeExistingComments(): Promise<void> {
    return Promise.resolve();
  }
}
