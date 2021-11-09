import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
// material
import { useTheme } from '@mui/material/styles';
import { withStyles } from '@mui/styles';
import { Dialog, DialogContent, Stack, useMediaQuery, List, ListItem, ListItemText, IconButton } from '@mui/material';
// iconos
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import arrowheadUpFill from '@iconify/icons-eva/arrowhead-up-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import arrowheadDownFill from '@iconify/icons-eva/arrowhead-down-fill';

// componentes
import TituloDialogo from '../dialogo/TituloDialogo';
import Texto from '../texto/Texto';
import CheckSeleccion from '../check/CheckSeleccion';
import BotonesDialogo from '../dialogo/BotonesDialogo';
// icons
import ThemeConfig from '../../../theme';
// utils
import { isDefined } from '../../../utils/utilitario';
// ----------------------------------------------------------------------

const StyledList = withStyles((theme) => ({
  root: {
    width: '100%',
    minWidth: 300,
    height: 350,
    border: `solid 1px ${theme.palette.divider}`,
    overflow: 'auto'
  }
}))(List);

function ordenar(columns) {
  return columns.sort((a, b) => (a.orden < b.orden ? -1 : 1));
}

export default function ConfigurarTabla({ open, setOpen, columns, getServicioConfigurarTabla, setColumns }) {
  const txtNombreVisual = useRef();
  const txtAnchoColumna = useRef();
  const chsFiltro = useRef();
  const chsMayusculas = useRef();

  const [columnsConfigura, setColumnsConfigura] = useState([]);
  const [seleccionada, setSeleccionada] = useState();
  const [index, setIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (isDefined(columns) && columns.length > 0) {
      // const col = columns.filter((col) => col.visible === true);
      let i = 0;
      columns.forEach((colActual) => {
        colActual.orden = i;
        i += 1;
      });
      setColumnsConfigura(columns);
    }
  }, [columns]); // eslint-disable-line react-hooks/exhaustive-deps

  const cerrar = () => {
    setOpen(false);
    setSeleccionada(undefined);
  };

  const seleccionarColumna = (columna, i) => {
    setSeleccionada(columna);
    setIndex(i);
    txtNombreVisual.current.setValue(columna.nombreVisual);
    txtAnchoColumna.current.setValue(columna.anchoColumna);
    chsMayusculas.current.setValue(columna.mayuscula || false);
    chsFiltro.current.setValue(columna.filtro || false);
  };

  const subir = () => {
    columnsConfigura[index - 1].orden = index;
    seleccionada.orden = index - 1;
    actualizarOrden();
    setIndex(index - 1);
  };

  const bajar = () => {
    columnsConfigura[index + 1].orden = index;
    seleccionada.orden = index + 1;
    actualizarOrden();
    setIndex(index + 1);
  };

  const inicio = () => {
    seleccionada.orden = 0;
    for (let i = 0; i < columnsConfigura.length; i += 1) {
      if (i !== index) columnsConfigura[i].orden = i;
    }
    actualizarOrden();
    setIndex(0);
  };

  const fin = () => {
    seleccionada.orden = columnsConfigura.length - 1;
    for (let i = 0; i < columnsConfigura.length; i += 1) {
      if (i !== index) columnsConfigura[i].orden = i;
    }
    actualizarOrden();
    setIndex(columnsConfigura.length - 1);
  };

  const actualizarOrden = () => {
    const newColumns = [...columnsConfigura];
    setColumnsConfigura(ordenar(newColumns));
  };

  const cambiarTexto = (event) => {
    seleccionada[event.target.name] = event.target.value;
  };

  const cambiarCheck = (event) => {
    seleccionada[event.target.name] = event.target.checked;
    actualizar();
  };

  const actualizar = () => {
    const newColumns = [...columnsConfigura];
    setColumnsConfigura(ordenar(newColumns));
  };

  const aceptar = async () => {
    setLoading(true);
    setColumns(columnsConfigura);
    await getServicioConfigurarTabla();
    setLoading(false);
    cerrar();
  };

  return (
    <ThemeConfig>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            cerrar();
          }
        }}
        disableEscapeKeyDown
        maxWidth="md"
      >
        <TituloDialogo onClose={cerrar}>Personalizar Columnas</TituloDialogo>
        <DialogContent sx={{ pb: 0 }}>
          <Stack direction={fullScreen ? 'column' : 'row'} spacing={{ xs: 3, sm: 2 }}>
            <Stack
              direction={fullScreen ? 'column' : 'row'}
              justifyContent={{ xs: 'center', sm: 'flex-start' }}
              spacing={1}
            >
              <Stack direction={fullScreen ? 'row' : 'column'} justifyContent="center" alignItems="center" spacing={0}>
                <IconButton
                  aria-label="delete"
                  disabled={!isDefined(seleccionada) || index === 0}
                  title="Subir"
                  onClick={subir}
                >
                  <Icon icon={arrowIosUpwardFill} width={20} height={20} />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  disabled={!isDefined(seleccionada) || index === 0}
                  title="Inicio"
                  onClick={inicio}
                >
                  <Icon icon={arrowheadUpFill} width={20} height={20} />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  disabled={!isDefined(seleccionada) || index === columnsConfigura.length - 1}
                  title="Bajar"
                  onClick={bajar}
                >
                  <Icon icon={arrowIosDownwardFill} width={20} height={20} />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  disabled={!isDefined(seleccionada) || index === columnsConfigura.length - 1}
                  title="Fin"
                  onClick={fin}
                >
                  <Icon icon={arrowheadDownFill} width={20} height={20} />
                </IconButton>
              </Stack>
              <Stack direction="row" justifyContent="flex-start" spacing={1}>
                <StyledList component="div" role="list">
                  {columnsConfigura.map(
                    (column, i) =>
                      column.visible && (
                        <ListItem
                          role="listitem"
                          key={i}
                          selected={seleccionada?.nombre === column.nombre}
                          onClick={() => seleccionarColumna(column, i)}
                          button
                          disableGutters
                          dense
                        >
                          <ListItemText sx={{ px: 2 }} primary={column.nombreVisual} />
                        </ListItem>
                      )
                  )}
                </StyledList>
              </Stack>
            </Stack>

            <Stack direction="column" justifyContent={{ xs: 'center', sm: 'flex-start' }} spacing={2}>
              <Texto
                name="nombreVisual"
                ref={txtNombreVisual}
                disabled={!isDefined(seleccionada)}
                onChange={cambiarTexto}
                onBlur={actualizar}
                label="NOMBRE VISUAL"
                sx={{ minWidth: 300 }}
                fullWidth
              />
              <Texto
                name="anchoColumna"
                ref={txtAnchoColumna}
                disabled={!isDefined(seleccionada)}
                onChange={cambiarTexto}
                onBlur={actualizar}
                label="ANCHO COLUMNA"
                sx={{ minWidth: 300 }}
                fullWidth
                type="number"
              />
              <CheckSeleccion
                name="filtro"
                ref={chsFiltro}
                disabled={!isDefined(seleccionada)}
                label="FILTRO"
                onChange={cambiarCheck}
              />
              <CheckSeleccion
                name="mayuscula"
                ref={chsMayusculas}
                disabled={!isDefined(seleccionada)}
                onChange={cambiarCheck}
                label="MAYUSCULAS"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <BotonesDialogo labelAceptar="Aplicar" loading={loading} onAceptar={aceptar} onCancelar={cerrar} />
      </Dialog>
    </ThemeConfig>
  );
}

ConfigurarTabla.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  columns: PropTypes.array,
  setColumns: PropTypes.func,
  getServicioConfigurarTabla: PropTypes.func
};
