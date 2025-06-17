"use client";

import { useState, ReactNode, useEffect, useRef, useMemo } from 'react';
import { ReactElement } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import useWindowSize from '@/hooks/useWindowSize.';
import styles from '@/adm/_component/common/AdmLayout.module.css';
import { Menu } from '@/types/next-auth';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  ClickAwayListener, Collapse,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  SvgIconProps,
  SwipeableDrawer,
} from '@mui/material';
import { COLORS } from '@/Styles/colorConstants';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { ADMIN_MENUS, getAuthorizedMenus } from '@/lib/auth/auth-config';
import { useUserStore } from '@/zustand/userStore';
import { clearAccessTokenFromStorage } from '@/utils/apiFetch';
// import { clearAccessToken } from '@/utils/apiFetch';

interface AdmLayoutProps {
  children: ReactNode;
}

interface DrawerContentProps {
  drawerOpen: boolean; // 데스크탑 Drawer의 아이콘/텍스트 표시 여부 제어
  setDrawerOpen: (drawerOpen: boolean) => void;
  isMobile?: boolean;
}

type topMenu = {
  idx: number;
  title: string;
  path: string;
  icon: ReactElement<SvgIconProps>;
}

const drawerWidth = 240;

const DrawerHeaderStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// Nav Drawer 메뉴 컨텐츠
// const DrawerContent = ({ drawerOpen, setDrawerOpen, isMobile }: DrawerContentProps) => {
//   const router: AppRouterInstance = useRouter();
//   const topMenuList : topMenu[] = [
//     {idx: 0, title: "대시보드", path: "/adm", icon: <DashboardIcon sx={{width: 22}} />},
//     {idx: 1, title: "게시판", path: "/adm/board", icon: <EditNoteIcon sx={{width: 22}} />},
//     {idx: 2, title: "상품", path: "/adm/gds", icon: <CardTravelIcon sx={{width: 22}} />},
//     {idx: 3, title: "회원관리", path: "/adm/member", icon: <FaceIcon sx={{width: 22}} />},
//     {idx: 4, title: "마이페이지", path: "/adm", icon: <ManageAccountsIcon sx={{width: 22}} />},
//   ]
//   const [currentMenu, setCurrentMenu] = useState(topMenuList[0]);
//
//   const handleSideNavigation = (menu: topMenu) => {
//     router.push(menu.path);
//     if (isMobile) setDrawerOpen(false);
//     setCurrentMenu(menu);
//   }
//
//   return (
//     <>
//       <Divider />
//       <List>
//         {topMenuList.map((item, index) => (
//           <ListItem key={index} disablePadding sx={{ display: 'block' }}>
//             <ListItemButton
//               sx={{
//                 minHeight: 48,
//                 justifyContent: isMobile || drawerOpen ? 'initial' : 'center',
//                 px: 2.5,
//               }}
//               onClick={() => handleSideNavigation(item)}
//             >
//               <ListItemIcon
//                 sx={{
//                   minWidth: 0,
//                   mr: isMobile || drawerOpen ? 3 : 'auto',
//                   justifyContent: 'center',
//                   color: currentMenu.idx === item.idx ? COLORS.primary.light: ""
//                 }}
//               >
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText
//                 primary={item.title}
//                 sx={{
//                   opacity: isMobile || drawerOpen ? 1 : 0,
//                   color: currentMenu.idx === item.idx ? COLORS.primary.light : ""
//               }}
//               />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </>
//   );
// };

// Nav Drawer 메뉴 컨텐츠
const DrawerContent = ({ drawerOpen, setDrawerOpen, isMobile }: DrawerContentProps) => {
  const router: AppRouterInstance = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

  const authorizedMenus = useMemo(
    () => getAuthorizedMenus(user?.role, ADMIN_MENUS),
    [user?.role]
  );

  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(() => {
    const activeParent = authorizedMenus.find(item =>
      item.children?.some(child => pathname.startsWith(child.path))
    );
    return activeParent ? activeParent.idx : null;
  });

  const handleMenuClick = (menu: Menu) => {
    if (menu.children) {
      setOpenMenuIdx(openMenuIdx === menu.idx ? null : menu.idx);
    } else if (menu.path) {
      router.push(menu.path);
      if (isMobile) setDrawerOpen(false);
    }
  };

  const handleSubMenuClick = (path: string) => {
    router.push(path);
    if (isMobile) setDrawerOpen(false);
  };

  if (status === "loading") {
    return <List><ListItem><ListItemText primary="메뉴 로딩중..." /></ListItem></List>;
  }

  return (
    <>
      <Divider />
      <List>
        {authorizedMenus.map((item) => {
          // 1. 상위 메뉴가 활성화될 조건: 현재 경로가 하위 메뉴 경로 중 하나로 시작하는 경우
          const isParentActive = item.children ?
            item.children.some(child => pathname.startsWith(child.path)) :
            (item.path ? pathname.startsWith(item.path) : false);

          return (
            <div key={item.idx}>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{ minHeight: 48, justifyContent: isMobile || drawerOpen ? 'initial' : 'center', px: 2.5 }}
                  onClick={() => handleMenuClick(item)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isMobile || drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      color: isParentActive ? COLORS.primary.light : "" // 상위 메뉴 활성화 색상
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      opacity: isMobile || drawerOpen ? 1 : 0,
                      color: isParentActive ? COLORS.primary.light : "" // 상위 메뉴 활성화 색상
                    }}
                  />
                  {(isMobile || drawerOpen) && item.children && (
                    openMenuIdx === item.idx ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>

              {item.children && (
                <Collapse in={openMenuIdx === item.idx} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => {
                      // 2. 하위 메뉴가 활성화될 조건: 현재 경로가 하위 메뉴 경로와 정확히 일치하는 경우
                      const isChildActive = pathname === child.path;

                      return (
                        <ListItemButton
                          key={child.path}
                          sx={{ pl: 4 }}
                          onClick={() => handleSubMenuClick(child.path)}
                        >
                          <ListItemText
                            primary={child.title}
                            sx={{ color: isChildActive ? COLORS.primary.light : "" }} // 하위 메뉴 활성화 색상
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </div>
          );
        })}
      </List>
    </>
  );
};

// 레이아웃
export default function AdmLayout({ children }: AdmLayoutProps) {
  const router = useRouter();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawer
  const [toggleOpen, setToggleOpen] = useState(false); // Drawer
  const anchorRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(toggleOpen);
  const { isMobile } = useWindowSize(); // isLaptop은 현재 사용되지 않으므로 제거해도 무방

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleToggle = () => {
    setToggleOpen((prevOpen) => !prevOpen);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // refreshToken 쿠키 삭제용
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '로그아웃 실패');
      }

      // ✅ 클라이언트 상태 정리
      clearAccessTokenFromStorage(); // localStorage accessToken 제거
      useUserStore.getState().clearUser(); // 유저 정보 초기화

      // 필요 시 React Query 캐시도 초기화
      // queryClient.clear();

      // ✅ 라우팅
      router.push('/');
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setToggleOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setToggleOpen(false);
    } else if (event.key === 'Escape') {
      setToggleOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  useEffect(() => {
    if (prevOpen.current === true && toggleOpen === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = toggleOpen;
  }, [toggleOpen]);

  // useWindowSize가 초기 로딩 중일 때
  if (isMobile === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: 'flex', width: '100dvw' }}>
      <CssBaseline />

      {/* 모바일 Drawer */}
      {isMobile && (
        <SwipeableDrawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerClose}
          onOpen={handleDrawerOpen}
          ModalProps={{
            keepMounted: true, // 모바일 성능 최적화
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <DrawerHeaderStyled>
            {
              drawerOpen ? (
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              ) : null
            }
          </DrawerHeaderStyled>
          <DrawerContent drawerOpen={true} setDrawerOpen={setDrawerOpen} isMobile={true} />
        </SwipeableDrawer>
      )}

      {/* 데스크탑 Drawer */}
      {!isMobile && (
        <DesktopStyledDrawer variant="permanent" open={drawerOpen} sx={{zIndex: "150"}}>
          <DrawerHeaderStyled>
            {
              drawerOpen ?
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
                :
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                    margin: 'auto', // 가운데 정렬 또는 필요에 맞게 조정
                    // display: drawerOpen ? 'none' : 'block',
                  }}
                >
                  <MenuIcon />
                </IconButton>
            }
          </DrawerHeaderStyled>
          <DrawerContent drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} isMobile={false}/>
        </DesktopStyledDrawer>
      )}

      {/* children Box */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0, }}>
        <header className={styles.header}>
          {
            isMobile ?
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerOpen}
                sx={{ mr: 2, display: isMobile ? 'block' : 'none' }} // 모바일일 때만 보이도록
              >
                <MenuIcon sx={{display: "block"}} />
              </IconButton>
              :
              <h2>Administrator Page</h2>
          }

          {/*{ isMobile && <h2>Administrator Page</h2> }*/}
          <div className={styles.header_right}>
            <p style={{marginLeft: isMobile ? 'auto' : 0}}>안녕하세요 관리자님!</p> {/* 간단한 정렬 */}
            <IconButton   ref={anchorRef} onClick={handleToggle}>
              <MoreVertIcon sx={{width: 22}}/>
            </IconButton >
            <Popper
              open={toggleOpen}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
              sx={{inset: "0px 19px auto auto !important", zIndex: 120}}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom-start' ? 'left top' : 'left bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={toggleOpen}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem onClick={handleClose}>홈으로 이동</MenuItem>
                        <MenuItem onClick={handleClose}>마이페이지</MenuItem>
                        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        </header>
        {/*<Box*/}
        {/*  component="main"*/}
        {/*  sx={{*/}
        {/*    display: 'flex',*/}
        {/*    flexDirection: 'column',*/}
        {/*    flexGrow: 1,*/}
        {/*    py: 3,*/}
        {/*    px: 5,*/}
        {/*    width: "100%",*/}
        {/*    height: 'calc(100dvh - 64px)',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {children}*/}
        {/*</Box>*/}
        {children}
      </Box>
    </Box>
  );
}

// --- Styled Components for Desktop Drawer ---
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// 데스크탑 전용으로 이름을 변경하여 명확히 함 (DesktopStyledDrawer)
const DesktopStyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({ // open prop을 직접 받도록 수정
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && { // open이 true일 때
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && { // open이 false일 때
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);
