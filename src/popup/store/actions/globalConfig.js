import { SET_GITHUB_TOKEN } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const setGithubToken = githubToken => ({
  type: SET_GITHUB_TOKEN,
  githubToken,
});
