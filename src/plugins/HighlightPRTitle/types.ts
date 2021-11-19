type SetPropertyParams = [string, string, string?];
type BaseConfig = {
  selector: string;
  styles: SetPropertyParams[];
};

type RepoConfig = {
  repoPath: string;
  titleRegexp: string;
};

export type HighlightPRTitleConfigMessage = BaseConfig & RepoConfig;

export type HighlightPRTitleConfig = BaseConfig & {
  repoConfig: RepoConfig[];
};
