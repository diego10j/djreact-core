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
          lectura={false}
          nombreTabla="sis_auditoria_acceso"
          campoPrimario="ide_auac"
          opcionesColumnas={[
            { nombre: 'ide_usua', visible: false },
            {
              nombre: 'detalle_auac',
              nombreVisual: 'DETALLE',
              ordenable: false,
              filtro: true,
              orden: 0
            },
            {
              nombre: 'ip_auac',
              nombreVisual: 'IP',
              filtro: true
            }
          ]}
        />
      </Container>
    </Page>
  );
}
