import { SET_GITHUB_TOKEN } from '../constants';

const initState = {
  githubToken: '',
};

const globalConfig = (state = initState, action) => {
  switch (action.type) {
    case SET_GITHUB_TOKEN:
      return {
        ...state,
        githubToken: action.githubToken,
      };
    default:
      return state;
  }
};

export default globalConfig;
