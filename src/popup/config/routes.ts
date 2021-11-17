type Routes = 'HOME' | 'GLOBAL_CONFIG' | 'PLUGIN_CONFIG' | 'MENU';
type RouteConfig = {
  path: string;
  title?: string;
};
export type RoutesConfig = Record<Routes, RouteConfig>;

export const routes: RoutesConfig = {
  HOME: {
    path: '/',
    title: 'Home',
  },
  GLOBAL_CONFIG: {
    path: '/global-config',
    title: 'Global Config',
  },
  PLUGIN_CONFIG: {
    path: '/plugin-config',
    title: 'Plugin Config',
  },
  MENU: {
    path: '/menu',
  },
};

export const getRouteConfigByPath = (path: string): RouteConfig | undefined => {
  const route = Object.values(routes).find((value) => value.path === path);
  return route;
};
