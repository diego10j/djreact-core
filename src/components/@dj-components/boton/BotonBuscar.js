import React from 'react';
import PropTypes from 'prop-types';
// iconos
import SearchIcon from '@material-ui/icons/Search';
// material
import { Tooltip } from '@material-ui/core';
// componentes
import { MIconButton } from '../../@material-extend';

export default function BotonBuscar({ color = 'primary', onClick }) {
  return (
    <Tooltip title="Buscar" arrow>
      <MIconButton aria-label="insertar" title="Insertar" color={color} onClick={onClick}>
        <SearchIcon width={20} height={20} />
      </MIconButton>
    </Tooltip>
  );
}

BotonBuscar.propTypes = {
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error'])
};
