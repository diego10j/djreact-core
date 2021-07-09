import React from 'react';
import PropTypes from 'prop-types';
// material
import { Icon } from '@iconify/react';
import { LoadingButton } from '@material-ui/lab';
import { Avatar, ButtonBase } from '@material-ui/core';
// iconos
import trash2Outline from '@iconify/icons-eva/trash-2-outline';

export default function BotonEliminar({ color = 'error', label = 'Eliminar', onClick, loading = false, ...other }) {
  return (
    <>
      <LoadingButton
        variant="contained"
        size="small"
        color={color}
        startIcon={<Icon icon={trash2Outline} width={20} height={20} />}
        onClick={onClick}
        loading={loading}
        {...other}
      >
        {label}
      </LoadingButton>

      <ButtonBase sx={{ borderRadius: '12px', width: '34px', height: '34px' }}>
        <Avatar variant="rounded">
          <Icon icon={trash2Outline} width={20} height={20} />
        </Avatar>
      </ButtonBase>
    </>
  );
}

BotonEliminar.propTypes = {
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error']),
  label: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};
