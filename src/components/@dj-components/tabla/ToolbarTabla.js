import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
// icons
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import brushOutline from '@iconify/icons-eva/brush-outline';
import refreshOutline from '@iconify/icons-eva/refresh-outline';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import TableRowsOutlinedIcon from '@material-ui/icons/TableRowsOutlined';

// components
import { Box, MenuItem, Tooltip, Divider } from '@material-ui/core';
import { Icon } from '@iconify/react';
import { MIconButton } from '../../@material-extend';
import MenuPopover from '../../MenuPopover';
import SvgIconStyle from '../../SvgIconStyle';
import { isDefined } from '../../../utils/utilitario';

export default function ToolbarTabla({
  actualizar,
  insertar,
  eliminar,
  cambiarVista,
  filaSeleccionada,
  showBotonInsertar,
  showBotonEliminar,
  showBotonModificar,
  vistaFormularo
}) {
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);
  const handleCerrar = () => {
    setOpen(false);
  };

  const handleOpciones = () => {
    setOpen(true);
  };

  const handleModificar = () => {
    console.log('modificar');
  };

  const handleActualizar = () => {
    actualizar();
    setOpen(false);
  };

  const handleCambiarVista = () => {
    setOpen(false);
    cambiarVista();
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
            {showBotonInsertar === true && (
              <MIconButton aria-label="insertar" title="Insertar" color="success" onClick={insertar}>
                <AddIcon fontSize="inherit" />
              </MIconButton>
            )}
            {showBotonModificar === true && (
              <MIconButton
                aria-label="modificar"
                title="Modificar"
                color="info"
                onClick={handleModificar}
                disabled={isDefined(filaSeleccionada) === false}
              >
                <CreateIcon fontSize="inherit" />
              </MIconButton>
            )}
            {showBotonEliminar === true && (
              <MIconButton
                aria-label="eliminar"
                title="Eliminar"
                color="error"
                onClick={eliminar}
                disabled={isDefined(filaSeleccionada) === false}
              >
                <DeleteIcon fontSize="inherit" />
              </MIconButton>
            )}
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

        <MenuItem sx={{ typography: 'body2', py: 1, px: 2.5 }} onClick={handleCambiarVista}>
          {vistaFormularo ? (
            <>
              <TableRowsOutlinedIcon
                fontSize="inherit"
                sx={{
                  mr: 2,
                  width: 24,
                  height: 24
                }}
              />
              Vista Tabla
            </>
          ) : (
            <>
              <ListAltOutlinedIcon
                fontSize="inherit"
                sx={{
                  mr: 2,
                  width: 24,
                  height: 24
                }}
              />
              Vista Formulario
            </>
          )}
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
  actualizar: PropTypes.func,
  insertar: PropTypes.func,
  eliminar: PropTypes.func,
  cambiarVista: PropTypes.func,
  filaSeleccionada: PropTypes.object,
  showBotonInsertar: PropTypes.bool,
  showBotonEliminar: PropTypes.bool,
  showBotonModificar: PropTypes.bool,
  vistaFormularo: PropTypes.bool
};
