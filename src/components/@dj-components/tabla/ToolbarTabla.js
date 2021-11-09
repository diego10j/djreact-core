import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
// icons
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import brushOutline from '@iconify/icons-eva/brush-outline';
import refreshOutline from '@iconify/icons-eva/refresh-outline';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';

// components
import { Box, MenuItem, Tooltip, Divider, Stack } from '@mui/material';
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
  onModificar,
  vistaFormularo,
  lectura,
  setAbrirConfigurar
}) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleCerrar = () => {
    setOpen(false);
  };

  const handleOpciones = () => {
    setOpen(true);
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
    setAbrirConfigurar(true);
    setOpen(false);
  };

  return (
    <>
      <div style={{ width: '100%', padding: 0 }}>
        <Box
          sx={{
            pt: 0,
            pb: 0,
            mt: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box width="95%" flexGrow={1} sx={{ pt: 0, pb: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-start">
              {showBotonInsertar === true && (
                <MIconButton aria-label="insertar" title="Insertar" color="success" onClick={insertar}>
                  <AddIcon fontSize="inherit" />
                </MIconButton>
              )}
              {isDefined(onModificar) === true && (
                <MIconButton
                  aria-label="modificar"
                  title="Modificar"
                  color="info"
                  onClick={onModificar}
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
            </Stack>
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

        {!lectura && (
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
        )}

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
  onModificar: PropTypes.func,
  vistaFormularo: PropTypes.bool,
  lectura: PropTypes.bool,
  setAbrirConfigurar: PropTypes.func
};
