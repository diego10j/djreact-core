import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled, useTheme } from '@mui/material/styles';
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import Settings from '../../components/settings';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 60;
const APP_BAR_DESKTOP = 64;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 2,
  paddingBottom: theme.spacing(2),
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 2,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const theme = useTheme();
  const { collapseClick } = useCollapseDrawer();
  const [open, setOpen] = useState(false);
  const [openOpciones, setOpenOpciones] = useState(false);
  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} setOpenOpciones={setOpenOpciones} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <Settings openOpciones={openOpciones} setOpenOpciones={setOpenOpciones} />
      <MainStyle
        sx={{
          transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.complex
          }),
          ...(collapseClick && {
            ml: '75px'
          })
        }}
      >
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
