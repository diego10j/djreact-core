import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import Settings from '../../components/settings';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 60;
const APP_BAR_DESKTOP = 64;

const RootStyle = styled('div')({
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE,
  paddingBottom: theme.spacing(5),
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 5
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [openOpciones, setOpenOpciones] = useState(false);
  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} setOpenOpciones={setOpenOpciones} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <Settings openOpciones={openOpciones} setOpenOpciones={setOpenOpciones} />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
