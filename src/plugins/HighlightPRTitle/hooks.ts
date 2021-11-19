import Hook from '../../utils/Hook';
import { HighlightPRTitleConfigMessage } from './types';

export const HOOK_NAMES = {
  CONFIG: 'config',
};

const hooks = {
  [HOOK_NAMES.CONFIG]: Hook<[HighlightPRTitleConfigMessage]>(['data']),
};

export default hooks;
