import DashboardIcon from '@mui/icons-material/Dashboard';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FaceIcon from '@mui/icons-material/Face';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
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
    path: "/adm",
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
    roles: [ROLES.SUPER_ADMIN],
    children: [
      {
        title: "일반 회원",
        path: "/adm/member/active",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        title: "탈퇴 회원",
        path: "/adm/member/withdrawn",
        roles: [ROLES.SUPER_ADMIN],
      },
    ]
  },
  {
    idx: 104,
    title: "마이페이지",
    path: "/adm",
    icon: <ManageAccountsIcon sx={{ width: 22 }} />,
    roles: [ROLES.EDITOR, ROLES.MANAGER, ROLES.SUPER_ADMIN],
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