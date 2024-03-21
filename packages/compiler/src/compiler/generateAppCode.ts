import fs from 'fs';
import routesCodegen from '../generators/routes.hbs';
import { AppRoute } from './parseRoutes';

export const generateAppCode = (compilerDir: string, routes: AppRoute[]) => {

  // Detect duplicated routes
  const parsedRoutes: AppRoute[] = []
  const tmpRoutes = {}
  for (const route of routes) {
    if (tmpRoutes[route.routeUrl]) {
      console.error(`Duplicated route: ${route.routeUrl}`);
    } else {
      parsedRoutes.push(route);
      tmpRoutes[route.routeUrl] = true;
    }
  }

  const filesToGenerate = {
    [`./${compilerDir}/project-routes.ts`]: routesCodegen({ routes: parsedRoutes })
  };

  Object.entries(filesToGenerate).forEach(([sceneName, sceneCode]) => {
    fs.writeFileSync(sceneName, sceneCode);
  });

}
