import React, { useRef, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// icons
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import brushOutline from '@iconify/icons-eva/brush-outline';
import refreshOutline from '@iconify/icons-eva/refresh-outline';

// components
import {
  Box,
  MenuItem,
  Tooltip,
  Divider,
  Toolbar,
  InputAdornment,
  TextField
} from '@material-ui/core';
import { Icon } from '@iconify/react';
import { MIconButton } from '../../@material-extend';
import MenuPopover from '../../MenuPopover';
import SvgIconStyle from '../../SvgIconStyle';

export default function ToolbarTabla({ insertar }) {
  const StyledToolbar = withStyles((theme) => ({
    root: {
      padding: '4px 4px 0'
    }
  }))(Toolbar);

  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);
  const handleCerrar = () => {
    setOpen(false);
  };

  const handleOpciones = (event) => {
    setOpen(true);
  };

  const handleInsertar = () => {
    insertar();
  };
  const handleModificar = () => {
    console.log('modificar');
  };
  const handleEliminar = () => {
    console.log('eliminar');
  };

  const handleActualizar = () => {
    console.log('actualizar');
    setOpen(false);
  };

  const handleExportarExcel = () => {
    console.log('exportar');
    setOpen(false);
  };

  const handlePersonalizar = () => {
    console.log('personalizar');
    setOpen(false);
  };

  return (
    <StyledToolbar variant="dense">
      <Box display="flex" flexGrow={1} sx={{ ml: 2 }}>
        <Tooltip title="Insertar">
          <MIconButton
            aria-label="insertar"
            color="success"
            onClick={handleInsertar}
          >
            <AddIcon fontSize="inherit" />
          </MIconButton>
        </Tooltip>
        <Tooltip title="Modificar">
          <MIconButton
            aria-label="modificar"
            color="info"
            onClick={handleModificar}
          >
            <CreateIcon fontSize="inherit" />
          </MIconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <MIconButton
            aria-label="eliminar"
            color="error"
            onClick={handleEliminar}
          >
            <DeleteIcon fontSize="inherit" />
          </MIconButton>
        </Tooltip>
      </Box>

      <TextField
        placeholder="Buscar"
        variant="standard"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <SearchIcon size="small" />
            </InputAdornment>
          )
        }}
      />

      <Tooltip title="Opciones">
        <MIconButton
          aria-label="opciones"
          onClick={handleOpciones}
          ref={anchorRef}
        >
          <MoreVertIcon />
        </MIconButton>
      </Tooltip>

      <MenuPopover
        open={open}
        onClose={handleCerrar}
        anchorEl={anchorRef.current}
        sx={{ width: 230 }}
      >
        <MenuItem
          sx={{ typography: 'body2', py: 1, px: 2.5 }}
          onClick={handleActualizar}
        >
          <Box
            component={Icon}
            icon={refreshOutline}
            sx={{
              mr: 2,
              width: 24,
              height: 24
            }}
          />
          Actualizar
        </MenuItem>
        <MenuItem
          sx={{ typography: 'body2', py: 1, px: 2.5 }}
          onClick={handleExportarExcel}
        >
          <Box
            component={SvgIconStyle}
            src="/static/icons/ic_excel.svg"
            sx={{
              mr: 2,
              width: 24,
              height: 24
            }}
          />
          <Box ml={2} />
          Exportar Excel
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          sx={{ typography: 'body2', py: 1, px: 2.5 }}
          onClick={handlePersonalizar}
        >
          <Box
            component={Icon}
            icon={brushOutline}
            sx={{
              mr: 2,
              width: 24,
              height: 24
            }}
          />
          Personalizar
        </MenuItem>
      </MenuPopover>
    </StyledToolbar>
  );
}

ToolbarTabla.propTypes = {
  insertar: PropTypes.func
};
