import { useRef } from 'react';

// material
import { Container, Button } from '@material-ui/core';
import { Icon } from '@iconify/react';
// iconos
import saveFill from '@iconify/icons-eva/save-fill';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import Tabla from '../../components/@dj-components/tabla/Tabla';

// ----------------------------------------------------------------------

export default function Simple() {
  const tabTabla1 = useRef();

  const guardar = () => {
    console.log('guardar');
    console.log(tabTabla1.current.getFilaSeleccionada());
  };

  return (
    <Page title="Simple">
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Simple"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Simple' }
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Icon icon={saveFill} width={20} height={20} />}
              onClick={guardar}
            >
              Guardar
            </Button>
          }
        />

        <Tabla
          ref={tabTabla1}
          numeroTabla={1}
          lectura
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
              filtro: true,
              lectura: true
            }
          ]}
        />
      </Container>
    </Page>
  );
}
