import React, { useRef, useState } from 'react';
import * as Yup from 'yup';
// material
import { Container, Card, Grid, Box } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Tabla from '../../components/@dj-components/tabla/Tabla';
import BotonGuardar from '../../components/@dj-components/boton/BotonGuardar';
import UploadImagen from '../../components/@dj-components/upload/UploadImagen';
// hooks
import useForm from '../../hooks/useForm';
import usePantalla from '../../hooks/usePantalla';

// ----------------------------------------------------------------------
export default function Empresa() {
  const pantalla = usePantalla();
  const tabTabla1 = useRef();
  const [isGuardar, setIsGuardar] = useState(false); // state boton Loading

  const condiciones = { condicion: 'ide_empr = ?', valores: [localStorage.getItem('ide_empr')] }; // de la tabla

  // Esquema de validaciones para el formulario
  const validationSchema = Yup.object().shape({
    nom_empr: Yup.string().required('El nombre de la empresa es requerido').nullable(),
    mail_empr: Yup.string()
      .required('El correo electrónico es requerido')
      .email('El correo electrónico no es válido')
      .nullable(),
    identificacion_empr: Yup.string().required('La identificación de la empresa es requerida').nullable(),
    pagina_empr: Yup.string().matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'La página web no es válida'
    ),
    telefono_empr: Yup.string().matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'El teléfono no es válido'
    )
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
    if (file) {
      tabTabla1.current.setValorFilaSeleccionada('logo_empr', file.nombreImagen);
      tabTabla1.current.modificar('logo_empr');
    }
  };

  return (
    <Page title="Empresa">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Datos de la Empresa"
          links={[{ name: 'Sistema', href: PATH_DASHBOARD.root }, { name: 'Empresa' }]}
          action={<BotonGuardar onClick={guardar} loading={isGuardar} />}
        />
        <Card sx={{ px: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 5, mt: 5 }}>
                <Tabla
                  ref={tabTabla1}
                  numeroTabla={1}
                  filasPorPagina={20}
                  nombreTabla="sis_empresa"
                  campoPrimario="ide_empr"
                  condiciones={condiciones}
                  showToolbar={false}
                  showPaginador={false}
                  showBuscar={false}
                  tipoFormulario
                  numeroColFormulario={2}
                  totalColumnasSkeleton={9}
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
