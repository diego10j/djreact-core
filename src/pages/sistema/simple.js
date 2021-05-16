// material
import { Container } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import Tabla from '../../components/@dj-components/tabla/Tabla';

// ----------------------------------------------------------------------

export default function Simple() {
  return (
    <Page title="Simple">
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Simple"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Simple' }
          ]}
        />

        <Tabla
          numeroTabla={1}
          nombreTabla="sis_opcion"
          campoPrimario="ide_opci"
          opcionesColumnas={[
            { nombre: 'manual_opci', visible: false },
            {
              nombre: 'nom_opci',
              nombreVisual: 'NOMBRE OPCION',
              ordenable: false,
              filtro: true,
              orden: 0
            },
            {
              nombre: 'tipo_opci',
              nombreVisual: 'Path',
              filtro: true
            }
          ]}
        />
      </Container>
    </Page>
  );
}
