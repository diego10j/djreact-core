import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Componente Check de Lectura

import { Stack, Checkbox, Skeleton, Avatar } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { withStyles } from '@material-ui/core/styles';
import { inicialesAvatar, isDefined, stringToColorAvatar } from '../../../utils/utilitario';
import { backendUrl } from '../../../config';

// Componentes que se dibujan en lugar de un campo de Texto

const StyledCheckbox = withStyles(() => ({
  root: {
    backgroundColor: 'transparent',
    outline: 'none',
    padding: 0,
    marggin: 0
  }
}))(Checkbox);

export function CheckLectura({ value: initialValue }) {
  return (
    <StyledCheckbox
      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
      disabled
      disableRipple
      name="check"
      checked={initialValue === true}
      color="primary"
      checkedIcon={<CheckBoxIcon fontSize="small" />}
    />
  );
}

CheckLectura.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

export function AvatarLectura({ value: initialValue, column: { campoNombreAvatar }, row: { values } }) {
  const imagen = isDefined(initialValue) ? `${backendUrl}/api/uploads/getImagen/${initialValue}` : null;
  return (
    <Stack alignItems="center" justifyContent="center">
      {isDefined(initialValue) || !isDefined(campoNombreAvatar) ? (
        <Avatar src={imagen} sx={{ width: 32, height: 32, my: 0.5 }} />
      ) : (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            my: 0.5,
            bgcolor: stringToColorAvatar(values[campoNombreAvatar])
          }}
        >
          {inicialesAvatar(values[campoNombreAvatar])}
        </Avatar>
      )}
    </Stack>
  );
}

AvatarLectura.propTypes = {
  value: PropTypes.string,
  column: PropTypes.object,
  row: PropTypes.object
};

export function ComboLectura({ value: initialValue, cell: column, combos }) {
  // const columna = columns.find((col) => col.nombre === column.column.nombre);
  const [listaCombo, setListaCombo] = useState(null);

  useEffect(() => {
    const combo = combos.find((col) => col.columna === column.column.nombre);

    if (combo) {
      setListaCombo(combo.listaCombo || []);
    }
  }, [combos]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {listaCombo === null ? (
        <Skeleton animation="wave" />
      ) : (
        initialValue !== '' && listaCombo.find((element) => element.value === initialValue)?.label
      )}
    </>
  );
}

ComboLectura.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cell: PropTypes.object,
  combos: PropTypes.array
};
