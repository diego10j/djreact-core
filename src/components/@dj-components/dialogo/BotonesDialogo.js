import PropTypes from 'prop-types';
// material
import { Button, DialogActions } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';

const BotonesDialogo = (props) => {
  const {
    children,
    loading = false,
    onCancelar,
    onAceptar,
    labelAceptar = 'Aceptar',
    labelCancelar = 'Cancelar',
    showBotonAceptar = true,
    showBotonCancelar = true
  } = props;

  return (
    <DialogActions>
      {children}
      {showBotonAceptar === true && (
        <Button variant="outlined" onClick={onCancelar} disabled={loading} sx={{ minWidth: 100 }}>
          {labelCancelar}
        </Button>
      )}
      {showBotonCancelar === true && (
        <LoadingButton variant="contained" autoFocus sx={{ minWidth: 100 }} onClick={onAceptar} loading={loading}>
          {labelAceptar}
        </LoadingButton>
      )}
    </DialogActions>
  );
};

BotonesDialogo.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  onCancelar: PropTypes.func.isRequired,
  onAceptar: PropTypes.func.isRequired,
  labelAceptar: PropTypes.string,
  labelCancelar: PropTypes.string,
  showBotonAceptar: PropTypes.bool,
  showBotonCancelar: PropTypes.bool
};

export default BotonesDialogo;
