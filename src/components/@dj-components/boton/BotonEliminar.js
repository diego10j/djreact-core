import React from 'react';
import PropTypes from 'prop-types';
// material
import { Icon } from '@iconify/react';
import { LoadingButton } from '@material-ui/lab';
// iconos
import trash2Outline from '@iconify/icons-eva/trash-2-outline';

export default function BotonEliminar({ color = 'error', label = 'Eliminar', onClick, loading, ...other }) {
  return (
    <LoadingButton
      variant="contained"
      color={color}
      startIcon={<Icon icon={trash2Outline} width={20} height={20} />}
      onClick={onClick}
      loading={loading}
      {...other}
    >
      {label}
    </LoadingButton>
  );
}

BotonEliminar.propTypes = {
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error']),
  label: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};
