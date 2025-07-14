import { ROLES } from '@/_constant/userRole';

interface PathRule {
  path: string;
  roles: string[];
}

/* ✅ 권한이 필요한 페이지 정의 */
export const PATH_RULES: PathRule[] = [
  /* ---사용자 경로 규칙--- */
  { path: '/my',                                roles: [ROLES.USER]},

  /* ---관리자(adm) 경로 규칙--- */
  // 대시보드
  { path: '/adm/dash',                          roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN] },

  // 게시판
  { path: '/adm/board',                         roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/board/add',                     roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/board/[id]',                    roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN] },

  // 상품
  // { path: '/adm/gds',                           roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN] },

  // 회원
  { path: '/adm/member/active',                 roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/member/active/[id]',            roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/member/withdrawn',              roles: [ROLES.SUPER_ADMIN] },
  { path: '/adm/member/withdrawn/[id]',         roles: [ROLES.SUPER_ADMIN] },

  // 마이페이지
  { path: '/adm/my',                            roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN]},

  // 기본설정
  { path: '/adm/setting/policy',                roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/setting/policy/add',            roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/setting/policy/[id]',           roles: [ROLES.SUPER_ADMIN] },
  { path: '/adm/setting/terms',                 roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/setting/terms/add',             roles: [ROLES.SUPER_ADMIN] },
  { path: '/adm/setting/terms/[id]',            roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN] },
  { path: '/adm/setting/terms/[id]/modify',     roles: [ ROLES.SUPER_ADMIN] },
];
