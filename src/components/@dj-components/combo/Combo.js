import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// material
import { MenuItem, TextField } from '@material-ui/core';
// servicios
import { getComboTabla } from '../../../services/sistema/servicioSistema';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// ----------------------------------------------------------------------

const StyledTextField = withStyles(() => ({
  root: {
    width: '8rem',
    '& .MuiInputBase-root': {
      height: '1.99rem'
    },
    '& .MuiOutlinedInput-input': {
      paddingBottom: 0
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 5
        // borderColor: 'transparent !important'
      }
    }
  }
}))(TextField);

Combo.propTypes = {
  value: PropTypes.string,
  labelNull: PropTypes.string,
  width: PropTypes.string,
  label: PropTypes.string,
  nombreTabla: PropTypes.string.isRequired,
  campoPrimario: PropTypes.string.isRequired,
  campoNombre: PropTypes.string.isRequired,
  condicion: PropTypes.string
};

export default function Combo({
  value,
  label = '',
  nombreTabla,
  campoPrimario,
  campoNombre,
  condicion,
  width = '17rem',
  labelNull = 'Null',
  ...other
}) {
  const isMountedRef = useIsMountedRef();
  const [listaCombo, setListaCombo] = useState([]);

  useEffect(() => {
    getServicioCombo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Obtiene las columnas del servicio web
   */
  const getServicioCombo = async () => {
    try {
      const { data } = await getComboTabla(nombreTabla, campoPrimario, campoNombre, condicion);
      if (isMountedRef.current) {
        setListaCombo([{ value: '', label: labelNull }, ...data.datos]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StyledTextField
      select
      label={label.toUpperCase()}
      value={value || ''}
      margin="none"
      variant="outlined"
      size="small"
      style={{ width, minWidth: width }}
      InputLabelProps={{
        shrink: true
      }}
      {...other}
    >
      {listaCombo.map((element, index) => (
        <MenuItem key={index} value={element.value}>
          {element.label}
        </MenuItem>
      ))}
    </StyledTextField>
  );
}
