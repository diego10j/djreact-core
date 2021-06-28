import React from 'react';
import PropTypes from 'prop-types';
// material
import { Icon } from '@iconify/react';
import { LoadingButton } from '@material-ui/lab';
// iconos
import saveOutline from '@iconify/icons-eva/save-outline';

export default function BotonGuardar({ color = 'primary', label = 'Guardar', onClick, loading = false, ...other }) {
  return (
    <LoadingButton
      color={color}
      variant="contained"
      startIcon={<Icon icon={saveOutline} width={20} height={20} />}
      onClick={onClick}
      loading={loading}
      {...other}
    >
      {label}
    </LoadingButton>
  );
}

BotonGuardar.propTypes = {
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error']),
  label: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};
