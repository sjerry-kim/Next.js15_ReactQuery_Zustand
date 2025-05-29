"use client";

import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import useWindowSize from '@/hooks/useWindowSize.';
import styles from '@/adm/_component/common/AdmLayout.module.css';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import { SwipeableDrawer } from '@mui/material';

interface AdmLayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;

const DrawerHeaderStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface DrawerContentProps {
  open: boolean; // 데스크탑 Drawer의 아이콘/텍스트 표시 여부 제어
  isMobile?: boolean;
}

// Nav Drawer Content
const DrawerContent = ({ open, isMobile }: DrawerContentProps) => {
  const router: AppRouterInstance = useRouter();
  const topMenuList = [
    {idx: 1, title: "게시판", path: "/adm/board", icon: <EditNoteIcon />},
    {idx: 2, title: "상품", path: "/adm/gds", icon: <CardTravelIcon />},
  ]
  const [currentMenu, setCurrentMenu] = useState(topMenuList[0]);

  const handleSideNavigation = (menu) => {
    router.push(menu.path);
    setCurrentMenu(menu);
  }

  return (
    <>
      <Divider />
      <List>
        {topMenuList.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: isMobile || open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => handleSideNavigation(item)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isMobile || open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: currentMenu.idx === item.idx ? "#A5B4FC" : ""
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  opacity: isMobile || open ? 1 : 0,
                  color: currentMenu.idx === item.idx ? "#A5B4FC" : ""
              }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/*<Divider />*/}
      {/*<List>*/}
      {/*  {['All mail', 'Trash', 'Spam'].map((text, index) => (*/}
      {/*    <ListItem key={text} disablePadding sx={{ display: 'block' }}>*/}
      {/*      <ListItemButton*/}
      {/*        sx={{*/}
      {/*          minHeight: 48,*/}
      {/*          justifyContent: isMobile || open ? 'initial' : 'center',*/}
      {/*          px: 2.5,*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <ListItemIcon*/}
      {/*          sx={{*/}
      {/*            minWidth: 0,*/}
      {/*            mr: isMobile || open ? 3 : 'auto',*/}
      {/*            justifyContent: 'center',*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}*/}
      {/*        </ListItemIcon>*/}
      {/*        <ListItemText*/}
      {/*          primary={text}*/}
      {/*          sx={{ opacity: isMobile || open ? 1 : 0 }}*/}
      {/*        />*/}
      {/*      </ListItemButton>*/}
      {/*    </ListItem>*/}
      {/*  ))}*/}
      {/*</List>*/}
    </>
  );
};

export default function AdmLayout({ children }: AdmLayoutProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false); // 모바일, 데스크탑 공통으로 Drawer 열림 상태 관리
  const { isMobile } = useWindowSize(); // isLaptop은 현재 사용되지 않으므로 제거해도 무방

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
          open={open}
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
              open ? (
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              ) : null
            }
          </DrawerHeaderStyled>
          <DrawerContent open={true} isMobile={true} />
        </SwipeableDrawer>
      )}

      {/* 데스크탑 Drawer */}
      {!isMobile && (
        <DesktopStyledDrawer variant="permanent" open={open}>
          <DrawerHeaderStyled>
            {
              open ?
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
                    // display: open ? 'none' : 'block',
                  }}
                >
                  <MenuIcon />
                </IconButton>
            }
          </DrawerHeaderStyled>
          <DrawerContent open={open} isMobile={false}/>
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
                <MenuIcon />
              </IconButton>
              :
              <h2>Administrator Page</h2>
          }

          {/*{ isMobile && <h2>Administrator Page</h2> }*/}
          <p style={{marginLeft: isMobile ? 'auto' : 0}}>안녕하세요 관리자님!</p> {/* 간단한 정렬 */}
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