import {
  ADD_REPOSITORY_CONFIG,
  DELETE_REPOSITORY_CONFIG,
  EDIT_REPOSITORY_CONFIG,
  SET_REPOSITORY_CONFIG,
} from '../constants';

export const setRepositoryConfig = config => ({
  type: SET_REPOSITORY_CONFIG,
  config,
});

export const addRepositoryConfig = owner => ({
  type: ADD_REPOSITORY_CONFIG,
  owner,
});

export const deleteRepositoryConfig = owner => ({
  type: DELETE_REPOSITORY_CONFIG,
  owner,
});

export const editRepositoryConfig = (owner, repoConfig) => ({
  type: EDIT_REPOSITORY_CONFIG,
  owner,
  repoConfig,
});
