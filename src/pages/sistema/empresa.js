import React, { useRef, useState, useEffect } from 'react';
// formulario
import * as Yup from 'yup';
// material
import { Container, Card, TableContainer, Grid, Box, Typography } from '@material-ui/core';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@material-ui/lab';
// iconos
import saveFill from '@iconify/icons-eva/save-fill';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Tabla from '../../components/@dj-components/tabla/Tabla';
import { UploadAvatar } from '../../components/upload';
// hooks
import usePantalla from '../../hooks/usePantalla';
import { fData } from '../../utils/formatNumber';

// ----------------------------------------------------------------------
export default function Empresa() {
  const pantalla = usePantalla();
  const tabTabla1 = useRef();
  const [isGuardar, setIsGuardar] = useState(false);

  // validaciones
  const validationSchema = Yup.object().shape({
    nom_empr: Yup.string().required('El nombre de la empresa es requerido'),
    mail_empr: Yup.string().required('El correo electrónico es requerido').email('El correo electrónico no es válido'),
    identificacion_empr: Yup.string().required('La identificación de la empresa es requerida')
  });

  const guardar = async () => {
    validationSchema.isValid(tabTabla1.current.filaSeleccionada).then((valid) => {
      console.log(valid);
    });

    validationSchema.validate(tabTabla1.current.filaSeleccionada).catch((err) => {
      console.log(err);
      console.log(err.errors);
    });

    setIsGuardar(true);
    if (await tabTabla1.current.isGuardar()) {
      pantalla.guardar(tabTabla1);
    }
    setIsGuardar(false);
  };

  return (
    <Page title="Empresa">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Datos de la Empresa"
          links={[{ name: 'Sistema', href: PATH_DASHBOARD.root }, { name: 'Empresa' }]}
          action={
            <LoadingButton
              variant="contained"
              startIcon={<Icon icon={saveFill} width={20} height={20} />}
              onClick={guardar}
              loading={isGuardar}
            >
              Guardar
            </LoadingButton>
          }
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  maxSize={3145728}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <TableContainer sx={{ padding: 2 }}>
                <Tabla
                  ref={tabTabla1}
                  filasPorPagina={20}
                  numeroTabla={2}
                  nombreTabla="sis_empresa"
                  campoPrimario="ide_empr"
                  showToolbar={false}
                  showPaginador={false}
                  showBuscar={false}
                  tipoFormulario
                  numeroColFormulario={2}
                />
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
