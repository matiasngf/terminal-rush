export interface AppRoute {
  routeUrl: string;
  importPath: string;
}

export const parseRoutes = (pathList: string[]) => {
  const routes = pathList.map(parseRoute);
  return routes;
}


export const parseRoute = (path: string): AppRoute => {
  const routeUrl = path
    .replaceAll(/\\/g, '/')
    .replaceAll(/\/\$/g, '/:')
    .replace(/^src\/app\/scenes/, '')
    .replace(/.scene.[tj]sx$/, '')
    .replace(/\/index$/, '');
  const importPath = path.replaceAll(/\\/g, '/');
  return {
    routeUrl,
    importPath
  }
}
