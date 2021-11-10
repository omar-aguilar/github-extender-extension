import Hook from '../../utils/Hook';

export const HOOK_NAMES = {
  CONFIG: 'config',
};

const hooks = {
  [HOOK_NAMES.CONFIG]: Hook<[string, any]>(['name', 'data']),
};

export default hooks;
