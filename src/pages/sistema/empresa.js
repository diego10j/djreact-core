import React, { useRef, useState } from 'react';
// formulario
import * as Yup from 'yup';
// material
import { Container, Card, Grid, Box } from '@material-ui/core';
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
import UploadImagen from '../../components/@dj-components/upload/UploadImagen';
// hooks
import useForm from '../../hooks/useForm';
import usePantalla from '../../hooks/usePantalla';

// ----------------------------------------------------------------------
export default function Empresa() {
  const pantalla = usePantalla();
  const tabTabla1 = useRef();
  const [isGuardar, setIsGuardar] = useState(false); // state boton Loading

  // Esquema de validaciones para el formulario
  const validationSchema = Yup.object().shape({
    nom_empr: Yup.string().required('El nombre de la empresa es requerido').nullable(),
    mail_empr: Yup.string()
      .required('El correo electrónico es requerido')
      .email('El correo electrónico no es válido')
      .nullable(),
    identificacion_empr: Yup.string().required('La identificación de la empresa es requerida').nullable()
  });

  const hookFormulario = useForm(validationSchema); // hook Formulario

  const guardar = async () => {
    const { isGuardar } = tabTabla1.current;
    if (await hookFormulario.isValid()) {
      setIsGuardar(true);
      if (await isGuardar()) {
        pantalla.guardar(tabTabla1);
      }
      setIsGuardar(false);
    } else {
      // Despliega los errores y pinta los componentes con el mensaje de error
      hookFormulario.erroresValidacion();
    }
  };

  const onUpload = (file) => {
    console.log(file);
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
        <Card sx={{ px: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 5, mt: 5 }}>
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
                  hookFormulario={hookFormulario}
                  opcionesColumnas={[
                    {
                      nombre: 'logo_empr',
                      visible: false
                    }
                  ]}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 5, mt: 5 }}>
                <UploadImagen file={hookFormulario.values?.logo_empr} onUpload={onUpload} />
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Page>
  );
}
