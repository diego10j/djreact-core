import { Icon } from '@iconify/react';
import { useState, useRef } from 'react';
import closeFill from '@iconify/icons-eva/close-fill';
import optionsOutline from '@iconify/icons-eva/options-outline';
// material
import { Box, Drawer, Tooltip, Divider, Typography } from '@material-ui/core';
//
import { MIconButton } from '../@material-extend';
import SettingMode from './SettingMode';
import SettingDirection from './SettingDirection';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 260;

export default function Settings() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpenSettings = () => {
    setOpen(true);
  };

  const handleCloseSettings = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Configurar Tema">
        <MIconButton
          ref={anchorRef}
          onClick={handleOpenSettings}
          color={open ? 'primary' : 'default'}
        >
          <Icon icon={optionsOutline} width={20} height={20} />
        </MIconButton>
      </Tooltip>

      <Drawer
        open={open}
        anchor="right"
        onClose={handleCloseSettings}
        sx={{ zIndex: 1999 }}
        PaperProps={{
          sx: { width: DRAWER_WIDTH }
        }}
      >
        <Box
          sx={{
            py: 2,
            pr: 1,
            pl: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="subtitle1">Settings</Typography>
          <MIconButton onClick={handleCloseSettings}>
            <Icon icon={closeFill} width={20} height={20} />
          </MIconButton>
        </Box>
        <Divider />

        <Box sx={{ pt: 3, px: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Mode
          </Typography>
          <SettingMode />

          <Box sx={{ my: 3 }} />

          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Direction
          </Typography>
          <SettingDirection />
        </Box>
      </Drawer>
    </>
  );
}
