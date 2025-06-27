import DashboardIcon from '@mui/icons-material/Dashboard';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FaceIcon from '@mui/icons-material/Face';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BuildIcon from '@mui/icons-material/Build';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';
import { Menu, Role } from '@/types/next-auth';

export const ROLES = {
  USER: 'user', // 일반회원
  EDITOR: 'editor', // 일반관리자
  MANAGER: 'manager', // 중간관리자
  SUPER_ADMIN: 'super_admin', // 최고관리자
} as const;

// 권한이 필요한 유저 메뉴
export const USER_MENUS: Menu[] = [
  {
    idx: 0,
    title: "마이페이지",
    path: "/my",
    icon: <DashboardIcon sx={{ width: 22 }} />,
    roles: [],
  },
];

// 권한이 필요한 관리자 메뉴
export const ADMIN_MENUS: Menu[] = [
  {
    idx: 100,
    title: "대시보드",
    path: "/adm/dash",
    icon: <DashboardIcon sx={{ width: 22 }} />,
    roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN],
  },
  {
    idx: 101,
    title: "게시판",
    path: "/adm/board",
    icon: <EditNoteIcon sx={{ width: 22 }} />,
    roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN],
  },
  {
    idx: 102,
    title: "상품",
    path: "/adm/gds",
    icon: <CardTravelIcon sx={{ width: 22 }} />,
    roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN],
  },
  {
    idx: 103,
    title: "회원관리",
    path: "/adm/member",
    icon: <FaceIcon sx={{ width: 22 }} />,
    roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN],
    children: [
      {
        idx:1,
        title: "일반 회원",
        path: "/adm/member/active",
        roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN],
      },
      {
        idx: 2,
        title: "탈퇴 회원",
        path: "/adm/member/withdrawn",
        roles: [ROLES.SUPER_ADMIN],
      },
    ]
  },
  {
    idx: 104,
    title: "계정관리",
    path: "/adm/account",
    icon: <PersonIcon sx={{ width: 22 }} />,
    roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN],
    children: [
      {
        idx:1,
        title: "본사",
        path: "/adm/account/head",
        roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN],
      },
      {
        idx: 2,
        title: "외부 업체",
        path: "/adm/account/partner",
        roles: [ROLES.SUPER_ADMIN],
      },
    ]
  },
  {
    idx: 105,
    title: "마이페이지",
    path: "/adm/my",
    icon: <ManageAccountsIcon sx={{ width: 22 }} />,
    roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN],
  },
  {
    idx: 106,
    title: "기본설정",
    path: "/adm/setting",
    icon: <BuildIcon sx={{ width: 22 }} />,
    roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN],
    children: [
      {
        idx: 1,
        title: "역할 권한",
        path: "/adm/setting/auth",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        idx: 2,
        title: "정책",
        path: "/adm/policy",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        idx: 3,
        title: "이용약관",
        path: "/adm/terms",
        roles: [ROLES.SUPER_ADMIN],
      },
    ]
  },
  {
    idx: 107,
    title: "개발자 설정",
    path: "/adm/dev",
    icon: <CodeIcon sx={{ width: 22 }} />,
    roles: [ROLES.MANAGER, ROLES.SUPER_ADMIN],
    children: [
      {
        idx: 1,
        title: "공통 코드",
        path: "/adm/dev/code",
        roles: [ROLES.SUPER_ADMIN],
      },
    ]
  },
];

// 헬퍼 함수의 매개변수와 반환값에 타입 적용
export const getAuthorizedMenus = (
  userRole: Role | undefined | null,
  menuList: Menu[] // 어떤 메뉴 리스트를 필터링할지 인자로 받음
): Menu[] => {
  if (!userRole) return [];

  const authorizedMenus = menuList.map((menu): Menu | null => {
    if (!menu.roles.includes(userRole)) {
      return null;
    }
    if (menu.children) {
      const authorizedChildren = menu.children.filter(child =>
        child.roles!.includes(userRole)
      );
      return authorizedChildren.length > 0 ? { ...menu, children: authorizedChildren } : null;
    }
    return menu;
  }).filter((menu): menu is Menu => menu !== null);

  return authorizedMenus;
};