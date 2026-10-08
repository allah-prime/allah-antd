import type { IApi } from 'dumi';

// dumi 生成 atom 路由时会把 resolve.atomDirs 的 type 复数化作为前缀
// （ui → uis、edit → edits、drag → drags、mobile → mobiles），
// 这里把前缀映射回单数，使路由与导航配置（/ui、/edit、/drag、/mobile）一致。
const PREFIX_REMAP: Record<string, string> = {
  uis: 'ui',
  edits: 'edit',
  drags: 'drag',
  mobiles: 'mobile',
};

export default (api: IApi) => {
  api.modifyRoutes((routes) => {
    for (const route of Object.values(routes)) {
      if (!route.path) continue;
      const segments = route.path.split('/');
      const remapped = PREFIX_REMAP[segments[0]];
      if (!remapped) continue;
      segments[0] = remapped;
      route.path = segments.join('/');
      if (typeof route.absPath === 'string' && route.absPath.startsWith('/')) {
        route.absPath = `/${route.path}`;
      }
    }
    return routes;
  });
};
