import { ADMIN_MENUS, ROLES } from '@/_auth/auth-config';
import { Menu, SubMenu } from '@/types/next-auth';

interface BreadcrumbItem {
  title: string;
  path: string;
}

export function getBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean); // ex: ["adm", "member", "active"]
  const pathStack: BreadcrumbItem[] = [];

  let cumulativePath = '';

  const adminMenu = [
    { // 홈 추가
      idx: 99,
      title: "홈",
      path: "/adm",
      roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN],
    },
    ...ADMIN_MENUS,
  ]

  for (const segment of segments) {
    cumulativePath += `/${segment}`; // 누적 경로: /adm → /adm/member → /adm/member/active

    let found = findMenuByExactPath(adminMenu, cumulativePath);
    if (!found) break;
    
    pathStack.push({ title: found.title, path: found.path });
  }

  return pathStack;
}

// 재귀적으로 경로를 정확히 매칭해서 찾아주는 헬퍼 함수
function findMenuByExactPath(menus: Menu[], path: string): Menu | SubMenu | undefined {
  for (const menu of menus) {
    if (menu.path === path) return menu;

    if (menu.children) {
      const found = findMenuByExactPath(menu.children, path);
      if (found) return found;
    }
  }
  return undefined;
}