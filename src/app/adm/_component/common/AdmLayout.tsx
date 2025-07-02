"use client";

import { useState, ReactNode, useEffect, useRef, useMemo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import useWindowSize from '@/hooks/useWindowSize.';
import styles from '@/adm/_component/common/AdmLayout.module.css';
import { Menu, SubMenu } from '@/types/next-auth';

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
  Breadcrumbs,
  ClickAwayListener,
  Collapse,
  Grow,
  Link,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  SwipeableDrawer,
  Typography,
} from '@mui/material';
import { COLORS } from '@/_constant/colorConstants';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { ADMIN_MENUS, getAuthorizedMenus } from '@/_auth/auth-config';
import { useUserStore } from '@/zustand/userStore';
import { LuDot } from 'react-icons/lu';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAuthStore } from '@/zustand/authStore';
import { useQueryClient } from '@tanstack/react-query';
import NotificationButton from '@/adm/_component/common/NotificationButton';
import { getBreadcrumbsFromPath } from '@/utils/breadCrumbPathMaker';

interface AdmLayoutProps {
  children: ReactNode;
}

interface DrawerContentProps {
  drawerOpen: boolean;
  setDrawerOpen: (drawerOpen: boolean) => void;
  isMobile?: boolean;
}

const drawerWidth = 240;

const DrawerHeaderStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// Nav Drawer 메뉴 컨텐츠 (활성화 로직 개선 최종안)
const DrawerContent = ({ drawerOpen, setDrawerOpen, isMobile }: DrawerContentProps) => {
  const router: AppRouterInstance = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const openedByMenuClick = useRef(false);

  const authorizedMenus = useMemo(
    () => getAuthorizedMenus(user?.role, ADMIN_MENUS),
    [user?.role]
  );

  // --- 활성화 메뉴를 찾는 새로운 로직 ---
  const { activeMenuItem, activeParentItem } = useMemo(() => {
    // bestMatch가 Menu 또는 SubMenu, 또는 null이 될 수 있음을 명시합니다.
    let bestMatch: Menu | SubMenu | null = null;
    let parentOfBestMatch: Menu | null = null;
    let maxLength = -1;

    for (const parentMenu of authorizedMenus) {
      // 하위 메뉴가 없는 단일 메뉴 확인
      if (!parentMenu.children && parentMenu.path && pathname.startsWith(parentMenu.path)) {
        if (parentMenu.path.length > maxLength) {
          maxLength = parentMenu.path.length;
          bestMatch = parentMenu;
          parentOfBestMatch = parentMenu;
        }
      }

      // 하위 메뉴 확인
      if (parentMenu.children) {
        for (const childMenu of parentMenu.children) {
          if (childMenu.path && pathname.startsWith(childMenu.path)) {
            if (childMenu.path.length > maxLength) {
              maxLength = childMenu.path.length;
              bestMatch = childMenu; // 이제 SubMenu 타입을 할당해도 문제가 없습니다.
              parentOfBestMatch = parentMenu;
            }
          }
        }
      }
    }
    return { activeMenuItem: bestMatch, activeParentItem: parentOfBestMatch };
  }, [pathname, authorizedMenus]);


  const findActiveParentIndex = useCallback(() => {
    return activeParentItem ? activeParentItem.idx : null;
  }, [activeParentItem]);


  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(findActiveParentIndex);

  useEffect(() => {
    if (!isMobile) {
      if (!drawerOpen) {
        setOpenMenuIdx(null);
      } else {
        if (openedByMenuClick.current) {
          openedByMenuClick.current = false;
        } else {
          setOpenMenuIdx(findActiveParentIndex());
        }
      }
    }
  }, [drawerOpen, isMobile, findActiveParentIndex]);


  const handleMenuClick = (menu: Menu) => {
    if (!isMobile && !drawerOpen) {
      if (menu.children) {
        openedByMenuClick.current = true;
        setDrawerOpen(true);
        setOpenMenuIdx(menu.idx);
      } else if (menu.path) {
        router.push(menu.path);
      }
      return;
    }

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

  return (
    <>
      <Divider />
      <List>
        {authorizedMenus.map((item) => {
          // 상위 메뉴 활성화 여부는 위에서 계산한 activeParentItem과 현재 아이템(item)을 비교
          const isParentActive = activeParentItem?.idx === item.idx;

          return (
            <div key={item.idx}>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{ minHeight: 48, justifyContent: isMobile || drawerOpen ? 'initial' : 'center', px: 2.5 }}
                  onClick={() => handleMenuClick(item)}
                  selected={isParentActive}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isMobile || drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      color: isParentActive ? COLORS.primary.light : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      opacity: isMobile || drawerOpen ? 1 : 0,
                      color: isParentActive ? COLORS.primary.light : 'inherit'
                    }}
                  />
                  {(isMobile || drawerOpen) && item.children && (
                    openMenuIdx === item.idx ?
                      <ExpandLess sx={{color: isParentActive ? COLORS.primary.light : 'inherit'}} /> :
                      <ExpandMore sx={{color: isParentActive ? COLORS.primary.light : 'inherit'}} />
                  )}
                </ListItemButton>
              </ListItem>

              {item.children && (
                <Collapse in={openMenuIdx === item.idx} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => {
                      // 하위 메뉴 활성화 여부는 activeMenuItem과 현재 하위 메뉴(child)를 비교
                      const isChildActive = activeMenuItem?.path === child.path;

                      return (
                        <ListItemButton
                          key={child.path}
                          sx={{ pl: 4, gap: 1 }}
                          onClick={() => handleSubMenuClick(child.path)}
                        >
                          <LuDot style={{color: isChildActive ? COLORS.primary.light : 'inherit'}}/>
                          <ListItemText
                            primary={child.title}
                            sx={{
                              color: isChildActive ? COLORS.primary.light : 'inherit'
                            }}
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

export default function AdmLayout({ children }: AdmLayoutProps) {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawer
  const [toggleOpen, setToggleOpen] = useState(false); // Drawer
  const user = useUserStore((state) => state.user);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(toggleOpen);
  const { isMobile } = useWindowSize();
  const breadcrumbsPath = getBreadcrumbsFromPath(pathname);

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
      });

      // 서버에서의 로그아웃 요청이 실패하더라도 클라이언트 상태는 정리
      if (!res.ok) {
        console.error('서버 로그아웃에 실패!');
      }

      // 클라이언트의 모든 인증 관련 상태를 정리
      useAuthStore.getState().clearAccessToken();
      useUserStore.getState().setUser(null);

      // React Query에 캐시된 모든 데이터를 삭제
      // 다른 사용자가 로그인했을 때 이전 사용자의 데이터가 보이는 것을 방지
      queryClient.clear();

      // 메인페이지로 이동하여 모든 상태를 완전히 새로고침
      window.location.href = '/';

    } catch (error) {
      // todo 에러처리
      // 네트워크 에러 등 fetch 자체가 실패한 경우
      console.error('로그아웃 처리 중 에러 발생:', error);
      // 에러가 발생하더라도 사용자 경험을 위해 강제로 상태를 초기화하고 이동할 수 있습니다.
      alert('로그아웃 중 문제가 발생했습니다. 페이지를 새로고침합니다.');
      window.location.href = '/login';
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
          {/*<NotificationButton />*/}
        </DesktopStyledDrawer>
      )}

      {/* children Box */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0, width: '100dvh', overflowY: 'hidden' }}>
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
            <p style={{marginLeft: isMobile ? 'auto' : 0}}>안녕하세요 {user?.name}님 🩷</p> {/* 간단한 정렬 */}
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
                        <MenuItem
                          sx={{fontSize: "0.8125rem"}}
                          onClick={handleClose}
                        >
                          <HomeIcon sx={{ width: 18, marginRight: 1 }} />
                          홈으로 이동
                        </MenuItem>
                        <MenuItem
                          sx={{fontSize: "0.8125rem"}}
                          onClick={handleClose}
                        >
                          <ManageAccountsIcon sx={{ width: 18, marginRight: 1 }} />
                          마이페이지
                        </MenuItem>
                        <MenuItem
                          sx={{fontSize: "0.8125rem"}}
                          onClick={handleLogout}
                        >
                          <LogoutIcon sx={{ width: 18, marginRight: 1 }} />
                          로그아웃
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        </header>
        {/*{*/}
        {/*  // 대시보드가 아니고 && 모바일버전에서만 노출*/}
        {/*  (pathname !== '/adm/dash') &&*/}
        {/*  <>*/}
        {/*    <Breadcrumbs*/}
        {/*      separator={<NavigateNextIcon sx={{width: "18px", color: "#7E7E7E"}} />}*/}
        {/*      // separator=""*/}
        {/*      aria-label="breadcrumb"*/}
        {/*      sx={{*/}
        {/*        // position: "relative",*/}
        {/*        // top: "5px",*/}
        {/*        padding: "5px 30px 0 30px",*/}
        {/*        '& .MuiBreadcrumbs-separator': {*/}
        {/*          mx: 0,*/}
        {/*        },*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      {breadcrumbsPath.map((item, idx) => {*/}
        {/*        const isLast = idx === breadcrumbsPath.length - 1;*/}
        {/*        return (*/}
        {/*          idx === 0 ?*/}
        {/*            <Typography*/}
        {/*              key={item.path}*/}
        {/*              sx={{ cursor: 'pointer', color: '#7E7E7E', fontSize: "14px" }}*/}
        {/*              onClick={()=>router.push(item.path)}*/}
        {/*            >*/}
        {/*              {item.title}*/}
        {/*            </Typography> :*/}
        {/*            isLast ?*/}
        {/*              <Typography*/}
        {/*                key={item.path}*/}
        {/*                sx={{ color: '#A5B4FC', fontSize: "14px", fontWeight: "500" }}*/}
        {/*              >*/}
        {/*                {item.title}*/}
        {/*              </Typography> :*/}
        {/*              <Typography*/}
        {/*                key={item.path}*/}
        {/*                sx={{ color: '#7E7E7E', fontSize: "14px" }}*/}
        {/*              >*/}
        {/*                {item.title}*/}
        {/*              </Typography>*/}
        {/*        )*/}
        {/*      })}*/}
        {/*    </Breadcrumbs>*/}
        {/*    /!*{*!/*/}
        {/*    /!*  isMobile &&*!/*/}
        {/*    /!*  <h2 className={styles.page_title}>*!/*/}
        {/*    /!*    {breadcrumbsPath.map((item, idx) => {*!/*/}
        {/*    /!*      const isLast = idx === breadcrumbsPath.length - 1;*!/*/}
        {/*    /!*      return isLast && item.title*!/*/}
        {/*    /!*    })}*!/*/}
        {/*    /!*  </h2>*!/*/}
        {/*    /!*}*!/*/}
        {/*  </>*/}
        {/*}*/}
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