import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
// icons
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import brushOutline from '@iconify/icons-eva/brush-outline';
import refreshOutline from '@iconify/icons-eva/refresh-outline';

// components
import { Box, MenuItem, Tooltip, Divider } from '@material-ui/core';
import { Icon } from '@iconify/react';
import { MIconButton } from '../../@material-extend';
import MenuPopover from '../../MenuPopover';
import SvgIconStyle from '../../SvgIconStyle';
import FiltroGlobalTabla from './FiltroGlobalTabla';

export default function ToolbarTabla({
  globalFilter,
  setGlobalFilter,
  lectura,
  actualizar,
  insertar,
  eliminar,
  toggleAllRowsSelected,
  toggleRowSelected,
  page,
  prepareRow,
  setColumnaSeleccionada
}) {
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);
  const handleCerrar = () => {
    setOpen(false);
  };

  const handleOpciones = () => {
    setOpen(true);
  };

  const handleInsertar = async () => {
    if (!lectura) {
      const tmpPk = insertar();
      if (tmpPk) {
        const row = page[0]; // selecciona fila insertada
        await prepareRow(row);
        // selecciona columna 1 para que ponga el autofocus si es Texto
        setColumnaSeleccionada(row.cells[0].column.nombre);
        toggleAllRowsSelected(false); // clear seleccionadas
        toggleRowSelected('0');
      }
    }
  };

  const handleModificar = () => {
    console.log('modificar');
  };
  const handleEliminar = async () => {
    if (!lectura) {
      if (await eliminar()) {
        toggleAllRowsSelected(false); // clear seleccionadas
      }
    }
  };

  const handleActualizar = () => {
    actualizar();
    toggleAllRowsSelected(false); // clear seleccionadas
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
    <>
      <div style={{ width: '100%', padding: 0 }}>
        <Box
          sx={{
            pt: 0,
            pb: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box width="75%" flexGrow={1} sx={{ pt: 0, pb: 0 }}>
            <Tooltip title="Insertar">
              <MIconButton aria-label="insertar" color="success" onClick={handleInsertar}>
                <AddIcon fontSize="inherit" />
              </MIconButton>
            </Tooltip>
            <Tooltip title="Modificar">
              <MIconButton aria-label="modificar" color="info" onClick={handleModificar}>
                <CreateIcon fontSize="inherit" />
              </MIconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <MIconButton aria-label="eliminar" color="error" onClick={handleEliminar}>
                <DeleteIcon fontSize="inherit" />
              </MIconButton>
            </Tooltip>
          </Box>
          <Box sx={{ pt: 0, pb: 0 }}>
            <FiltroGlobalTabla globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          </Box>
          <Box sx={{ pt: 0, pb: 0 }}>
            <Tooltip title="Opciones">
              <MIconButton aria-label="opciones" onClick={handleOpciones} ref={anchorRef}>
                <MoreVertIcon />
              </MIconButton>
            </Tooltip>
          </Box>
        </Box>
      </div>
      <MenuPopover open={open} onClose={handleCerrar} anchorEl={anchorRef.current} sx={{ width: 230 }}>
        <MenuItem sx={{ typography: 'body2', py: 1, px: 2.5 }} onClick={handleActualizar}>
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
        <MenuItem sx={{ typography: 'body2', py: 1, px: 2.5 }} onClick={handleExportarExcel}>
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
        <MenuItem sx={{ typography: 'body2', py: 1, px: 2.5 }} onClick={handlePersonalizar}>
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
    </>
  );
}

ToolbarTabla.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
  actualizar: PropTypes.func.isRequired,
  insertar: PropTypes.func.isRequired,
  eliminar: PropTypes.func.isRequired,
  toggleAllRowsSelected: PropTypes.func.isRequired,
  toggleRowSelected: PropTypes.func.isRequired,
  lectura: PropTypes.bool.isRequired,
  page: PropTypes.array,
  prepareRow: PropTypes.func.isRequired,
  setColumnaSeleccionada: PropTypes.func.isRequired
};
