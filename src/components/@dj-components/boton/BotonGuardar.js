import React from 'react';
import PropTypes from 'prop-types';
// material
import { Icon } from '@iconify/react';
import { LoadingButton } from '@material-ui/lab';
// iconos
import saveFill from '@iconify/icons-eva/save-fill';

export default function BotonGuardar({ onClick, loading, ...other }) {
  return (
    <LoadingButton
      variant="contained"
      startIcon={<Icon icon={saveFill} width={20} height={20} />}
      onClick={onClick}
      loading={loading}
      {...other}
    >
      Guardar
    </LoadingButton>
  );
}

BotonGuardar.propTypes = {
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};
