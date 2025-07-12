import { ROLES } from './path-menu';

interface PathRule {
  path: string;
  roles: string[];
}

// ✅ 보호할 경로 규칙을 명시적으로 정의
export const PATH_RULES: PathRule[] = [
  // --- 사용자 경로 규칙 ---
  { path: '/my', roles: [ROLES.USER]},

  // --- 관리자(adm) 경로 규칙 ---
  { path: '/adm/dash', roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN] },

  { path: '/adm/board', roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/board/add', roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/board/[id]', roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN] },

  { path: '/adm/gds', roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN] },

  { path: '/adm/member/active', roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/member/active/[id]', roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/member/withdrawn', roles: [ROLES.SUPER_ADMIN] },
  { path: '/adm/member/withdrawn/[id]', roles: [ROLES.SUPER_ADMIN] },

  { path: '/adm/my', roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN]},

  { path: '/adm/setting/policy', roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/setting/policy/add', roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/setting/policy/[id]', roles: [ROLES.SUPER_ADMIN] },

  { path: '/adm/setting/terms', roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/setting/terms/add', roles: [ROLES.SUPER_ADMIN] },
  { path: '/adm/setting/terms/[id]', roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/setting/terms/[id]/modify', roles: [ ROLES.SUPER_ADMIN] },
];
