import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
// material
import { withStyles, alpha, useTheme, experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  Typography,
  DialogContent,
  Stack,
  DialogActions,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  IconButton,
  Grid
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

export default function ConfigurarTabla({ open, setOpen, columns }) {
  const columnsConfigura = [...columns];
  const [seleccionada, setSeleccionada] = useState();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const cerrar = () => {
    setOpen(false);
    setSeleccionada(undefined);
  };

  const seleccionarColumna = (columna, i) => {
    setSeleccionada(columna);
    setIndex(i - 1);
  };

  const ordenar = () => {
    columnsConfigura.sort((a, b) => (a.orden < b.orden ? -1 : 1));
  };

  const subirColumna = () => {
    seleccionada.orden -= 1;
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
                  onClick={subirColumna}
                >
                  <Icon icon={arrowIosUpwardFill} width={20} height={20} />
                </IconButton>
                <IconButton aria-label="delete" disabled={!isDefined(seleccionada) || index === 0} title="Inicio">
                  <Icon icon={arrowheadUpFill} width={20} height={20} />
                </IconButton>
                <IconButton aria-label="delete" disabled={!isDefined(seleccionada)} title="Bajar">
                  <Icon icon={arrowIosDownwardFill} width={20} height={20} />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  disabled={!isDefined(seleccionada) || index === columnsConfigura.length}
                  title="Fin"
                >
                  <Icon icon={arrowheadDownFill} width={20} height={20} />
                </IconButton>
                {columnsConfigura.length}
              </Stack>
              <Stack direction="row" justifyContent="flex-start" spacing={1}>
                <StyledList component="nav" subheader={<ListSubheader>Columnas</ListSubheader>}>
                  {columnsConfigura.length > 0 &&
                    columnsConfigura.map(
                      (column, i) =>
                        column.visible && (
                          <ListItem
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
                disabled={!isDefined(seleccionada)}
                value={seleccionada?.nombrevisual || ''}
                label="NOMBRE VISUAL"
                sx={{ minWidth: 300 }}
                fullWidth
              />
              <Texto
                disabled={!isDefined(seleccionada)}
                value={seleccionada?.anchocolumna || ''}
                label="ANCHO COLUMNA"
                sx={{ minWidth: 300 }}
                fullWidth
                type="number"
              />
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
