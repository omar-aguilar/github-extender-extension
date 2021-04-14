import { combineReducers } from 'redux';
import globalConfig from './globalConfig';
import repositoryConfig from './repositoryConfig';

export default combineReducers({
  globalConfig,
  repositoryConfig,
});
