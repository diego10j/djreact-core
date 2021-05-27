import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Componente Check de Lectura
import Checkbox from '@material-ui/core/Checkbox';
import Skeleton from '@material-ui/core/Skeleton';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { withStyles } from '@material-ui/core/styles';

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
      value={initialValue || false}
      checked={initialValue || false}
      color="primary"
      checkedIcon={<CheckBoxIcon fontSize="small" />}
    />
  );
}

CheckLectura.propTypes = {
  value: PropTypes.bool
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
        listaCombo.find((element) => element.value === initialValue)?.label
      )}
    </>
  );
}

ComboLectura.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cell: PropTypes.object,
  combos: PropTypes.array
};
