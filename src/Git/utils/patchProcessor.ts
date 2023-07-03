import { Diff, Patch } from '../@types/PatchTypes';

export function getPatch(patch?: string): Patch[] {
  if (!patch) return [];

  const touchLines: Patch[] = [];
  const splitter = /\n(?=@@)/g;
  const diffInfoMatcher = /@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/;
  const diffs = patch.split(splitter);

  diffs.forEach((diff) => {
    const [diffInfo, ...content] = diff.split('\n');
    const diffMatch = diffInfo.match(diffInfoMatcher);
    if (!diffMatch) return;

    const [, _from] = diffMatch;
    if (_from === '0') return;

    const from = Number.parseInt(_from);
    const addedLines = content.filter((line) => line[0] !== '-');
    touchLines.push(...getPatchSingleSection(addedLines, from));
  });

  return touchLines;
}

function getPatchSingleSection(lines: string[], from: number): Patch[] {
  return lines.reduce((patches, line, index) => {
    if (line[0] !== '+') return patches;

    const currentLine = from + index;
    const lastPatch = patches.slice(-1).pop();

    if (lastPatch?.to !== currentLine - 1) {
      return patches.concat({ from: currentLine, to: currentLine });
    }

    return patches
      .slice(0, -1)
      .concat({ from: lastPatch?.from ?? currentLine, to: currentLine });
  }, [] as Patch[]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDiff(patches?: string): Diff[] {
  if (!patches) return [];

  const splitter = /diff --git.*?(?=diff --git|$)/gs;
  const heading = /diff --git.*?(?=@@)/gs;
  const diffInfoMatcher = /diff --git a\/([\S]+) b\/([\S]+)/;

  const eachFileDiffs = patches.match(splitter);
  if (!eachFileDiffs) return [];

  return eachFileDiffs.map((diff) => {
    const [_, _filenameA, _filenameB] = diff.match(diffInfoMatcher) ?? ['', ''];
    const content = diff.split(heading);
    console.log(_filenameB, content[1]);
    return {
      file: _filenameB,
      patch: getPatch(content[1]),
    };
  });

  // eachFileDiffs.forEach((diff) => {
  //   const [diffInfo, ...content] = diff.split('\n');
  //   const diffMatch = diffInfo.match(diffInfoMatcher);
  //   if (!diffMatch) return;

  //   console.log('diffInfo', diffInfo);
  //   console.log('content', content);
  //   console.log('diffMatch', diffMatch);
  // });
}
