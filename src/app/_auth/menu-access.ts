import { USER_MENUS, ADMIN_MENUS } from './auth-config';
import { Menu } from '@/types/next-auth';

interface ProtectedPath {
  path: string;
  roles?: string[];
}

// children까지 flatten 해서 path+roles 추출
function extractProtectedPaths(menus: Menu[]): ProtectedPath[] {
  const paths: ProtectedPath[] = [];

  for (const menu of menus) {
    if (menu.path && menu.roles) {
      paths.push({ path: menu.path, roles: menu.roles });
    }

    if (menu.children) {
      for (const child of menu.children) {
        paths.push({ path: child.path, roles: child.roles });
      }
    }
  }

  return paths;
}

export const PROTECTED_PATHS: ProtectedPath[] = [
  ...extractProtectedPaths(USER_MENUS),
  ...extractProtectedPaths(ADMIN_MENUS),
];
