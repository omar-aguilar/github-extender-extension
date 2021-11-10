import Hook from '../../utils/Hook';

export const HOOK_NAMES = {
  OPEN_TIME: 'openTime',
};

const hooks = {
  [HOOK_NAMES.OPEN_TIME]: Hook<[string, any]>(['name', 'data']),
};

export default hooks;
