import React from 'react';
import PropTypes from 'prop-types';
// iconos
import SearchIcon from '@material-ui/icons/Search';
// material
import { Tooltip, Button } from '@material-ui/core';

export default function BotonBuscar({ color = 'primary', onClick }) {
  return (
    <Tooltip title="Buscar" arrow>
      <Button
        variant="contained"
        aria-label="buscar"
        size="small"
        color={color}
        onClick={onClick}
        sx={{ minWidth: 0, height: '2rem' }}
      >
        <SearchIcon size="small" />
      </Button>
    </Tooltip>
  );
}

BotonBuscar.propTypes = {
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error']),
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired
};
