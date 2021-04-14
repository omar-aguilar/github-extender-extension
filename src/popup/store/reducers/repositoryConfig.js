import {
  ADD_REPOSITORY_CONFIG,
  DELETE_REPOSITORY_CONFIG,
  EDIT_REPOSITORY_CONFIG,
  SET_REPOSITORY_CONFIG,
} from '../constants';

const initState = {
  config: {},
};

const repositoryConfig = (state = initState, action) => {
  switch (action.type) {
    case SET_REPOSITORY_CONFIG:
      return {
        ...state,
        config: action.config,
      };
    case ADD_REPOSITORY_CONFIG:
      return {
        ...state,
        config: {
          ...state.config,
          [action.owner]: {
            owner: action.owner,
            repoConfig: '',
          },
        },
      };
    case DELETE_REPOSITORY_CONFIG: {
      const { [action.owner]: removedOwner, ...newConfig } = state.config;
      return {
        ...state,
        config: newConfig,
      };
    }
    case EDIT_REPOSITORY_CONFIG: {
      const { owner, repoConfig } = action;
      return {
        ...state,
        config: {
          ...state.config,
          [owner]: {
            owner,
            repoConfig,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default repositoryConfig;
