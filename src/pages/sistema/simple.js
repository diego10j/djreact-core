// material
import { Container } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import Tabla from '../../components/@dj-components/tabla/Tabla';
import TablaE from '../../components/@dj-components/tabla/TablaE';

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
          lectura
          nombreTabla="sis_usuario"
          campoPrimario="ide_usua"
          opcionesColumnas={[
            { nombre: 'ide_empr', visible: false },
            {
              nombre: 'ide_perf',
              nombreVisual: 'COD PERFIL',
              ordenable: false
            },
            { nombre: 'nom_usua', nombreVisual: 'USUARIO', orden: 0 }
          ]}
        />

        <TablaE />
      </Container>
    </Page>
  );
}
