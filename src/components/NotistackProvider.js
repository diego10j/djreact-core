import React from 'react';
import PropTypes from 'prop-types';
import { SnackbarProvider } from 'notistack';
import Grow from '@material-ui/core/Grow';

import infoFill from '@iconify/icons-eva/info-fill';
import alertCircleFill from '@iconify/icons-eva/alert-circle-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import checkmarkCircle2Fill from '@iconify/icons-eva/checkmark-circle-2-fill';
// material
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import { Box } from '@material-ui/core';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => {
  const createStyle = {
    zIndex: '3000 !important',
    marginTop: 10
  };

  return {
    containerRoot: {
      '& .MuiCollapse-wrapperInner': {
        width: '100%'
      }
    },
    contentRoot: {
      width: '100%',
      padding: theme.spacing(1.5),
      margin: theme.spacing(0.25, 0)
    },
    message: {
      padding: 0,
      fontWeight: theme.typography.fontWeightMedium
    },
    info: { ...createStyle },
    success: { ...createStyle },
    warning: { ...createStyle },
    error: { ...createStyle }
  };
});

export default function NotistackProvider({ children }) {
  const classes = useStyles();
  return (
    <SnackbarProvider
      maxSnack={5}
      preventDuplicate
      autoHideDuration={3000}
      classes={{
        containerRoot: classes.containerRoot,
        contentRoot: classes.contentRoot,
        message: classes.message,
        variantInfo: classes.info,
        variantSuccess: classes.success,
        variantWarning: classes.warning,
        variantError: classes.error
      }}
      iconVariant={{
        success: <SnackbarIcon icon={checkmarkCircle2Fill} />,
        error: <SnackbarIcon icon={infoFill} />,
        warning: <SnackbarIcon icon={alertTriangleFill} />,
        info: <SnackbarIcon icon={alertCircleFill} />
      }}
      TransitionComponent={Grow}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      {children}
    </SnackbarProvider>
  );
}

NotistackProvider.propTypes = {
  children: PropTypes.node
};

// ----------------------------------------------------------------------

function SnackbarIcon({ icon }) {
  return (
    <Box
      component="span"
      sx={{
        mr: 1.5,
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Icon icon={icon} width={24} height={24} />
    </Box>
  );
}
SnackbarIcon.propTypes = {
  icon: PropTypes.object
};
