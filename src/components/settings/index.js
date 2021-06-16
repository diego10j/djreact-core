import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import { Box, Backdrop, Paper, Divider, Typography, Stack } from '@material-ui/core';
//
import Scrollbar from '../Scrollbar';
import { MIconButton } from '../@material-extend';
import SettingMode from './SettingMode';
import SettingColor from './SettingColor';
import SettingDirection from './SettingDirection';
import SettingFullscreen from './SettingFullscreen';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 260;

export default function Settings({ openOpciones, setOpenOpciones }) {
  const handleClose = () => {
    setOpenOpciones(false);
  };

  return (
    <>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openOpciones} onClick={handleClose} />
      <Box
        sx={{
          top: 12,
          bottom: 12,
          right: 0,
          position: 'fixed',
          zIndex: (theme) => theme.zIndex.drawer + 2,
          ...(openOpciones && { right: 12 })
        }}
      >
        <Paper
          sx={{
            height: 1,
            width: '0px',
            overflow: 'hidden',
            boxShadow: (theme) => theme.customShadows.z24,
            transition: (theme) => theme.transitions.create('width'),
            ...(openOpciones && { width: DRAWER_WIDTH })
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
            <Typography variant="subtitle1">Ajustes</Typography>
            <MIconButton onClick={handleClose}>
              <Icon icon={closeFill} width={20} height={20} />
            </MIconButton>
          </Stack>
          <Divider />

          <Scrollbar sx={{ height: 1 }}>
            <Stack spacing={4} sx={{ pt: 3, px: 3, pb: 15 }}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Modo</Typography>
                <SettingMode />
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">DIrección</Typography>
                <SettingDirection />
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Color</Typography>
                <SettingColor />
              </Stack>

              <SettingFullscreen />
            </Stack>
          </Scrollbar>
        </Paper>
      </Box>
    </>
  );
}

Settings.propTypes = {
  openOpciones: PropTypes.bool,
  setOpenOpciones: PropTypes.func
};
