import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
// material
import { withStyles, useTheme } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  DialogActions,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  IconButton
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// iconos
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import arrowheadUpFill from '@iconify/icons-eva/arrowhead-up-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import arrowheadDownFill from '@iconify/icons-eva/arrowhead-down-fill';

// componentes
import TituloDialogo from '../dialogo/TituloDialogo';
import Texto from '../texto/Texto';
import CheckSeleccion from '../check/CheckSeleccion';
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
    border: `solid 1px ${theme.palette.divider}`
  }
}))(List);

function ordenar(columns) {
  return columns.sort((a, b) => (a.orden < b.orden ? -1 : 1));
}

export default function ConfigurarTabla({ open, setOpen, columns }) {
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
      const col = columns.filter((col) => col.visible === true);
      let i = 0;
      col.forEach((colActual) => {
        colActual.orden = i;
        i += 1;
      });
      setColumnsConfigura(col);
    }
  }, [columns]); // eslint-disable-line react-hooks/exhaustive-deps

  const cerrar = () => {
    setOpen(false);
    setSeleccionada(undefined);
  };

  const seleccionarColumna = (columna, i) => {
    setSeleccionada(columna);
    setIndex(i);
    txtNombreVisual.current.setValue(columna.nombrevisual);
    txtAnchoColumna.current.setValue(columna.anchocolumna);
    chsMayusculas.current.setValue(columna.mayuscula || false);
    chsFiltro.current.setValue(columna.filtro || false);
  };

  const subir = () => {
    columnsConfigura[index - 1].orden = index;
    seleccionada.orden = index - 1;
    actualizar();
    setIndex(index - 1);
  };

  const bajar = () => {
    columnsConfigura[index + 1].orden = index;
    seleccionada.orden = index + 1;
    actualizar();
    setIndex(index + 1);
  };

  const inicio = () => {
    seleccionada.orden = 0;
    for (let i = 0; i < columnsConfigura.length; i += 1) {
      if (i !== index) columnsConfigura[i].orden = i;
    }
    actualizar();
    setIndex(0);
  };

  const fin = () => {
    seleccionada.orden = columnsConfigura.length - 1;
    for (let i = 0; i < columnsConfigura.length; i += 1) {
      if (i !== index) columnsConfigura[i].orden = i;
    }
    actualizar();
    setIndex(columnsConfigura.length - 1);
  };

  const actualizar = () => {
    const newColumns = [...columnsConfigura];
    setColumnsConfigura(ordenar(newColumns));
  };

  const cambiarNombreVisual = (value) => {
    seleccionada.nombrevisual = value;
    const newColumns = [...columnsConfigura];
    setColumnsConfigura(newColumns);
  };

  return (
    <ThemeConfig>
      <Dialog fullScreen={fullScreen} open={open} onClose={cerrar} maxWidth="md">
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
                <StyledList component="div" role="list" subheader={<ListSubheader>Columnas</ListSubheader>}>
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
                          <ListItemText sx={{ px: 2 }} primary={column.nombrevisual} />
                        </ListItem>
                      )
                  )}
                </StyledList>
              </Stack>
            </Stack>

            <Stack direction="column" justifyContent={{ xs: 'center', sm: 'flex-start' }} spacing={2}>
              <Texto
                ref={txtNombreVisual}
                disabled={!isDefined(seleccionada)}
                onChange={cambiarNombreVisual}
                label="NOMBRE VISUAL"
                sx={{ minWidth: 300 }}
                fullWidth
              />
              <Texto
                ref={txtAnchoColumna}
                disabled={!isDefined(seleccionada)}
                label="ANCHO COLUMNA"
                sx={{ minWidth: 300 }}
                fullWidth
                type="number"
              />
              <CheckSeleccion ref={chsFiltro} disabled={!isDefined(seleccionada)} label="FILTRO" />
              <CheckSeleccion ref={chsMayusculas} disabled={!isDefined(seleccionada)} label="MAYUSCULAS" />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={cerrar}>
            Cancelar
          </Button>
          <LoadingButton variant="contained" autoFocus sx={{ minWidth: 100 }} loading={loading}>
            Aplicar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </ThemeConfig>
  );
}

ConfigurarTabla.propTypes = {
  columns: PropTypes.array
};
