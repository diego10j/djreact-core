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
    console.log(tabTabla1.current.getModificadas());
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
          lectura={false}
          nombreTabla="sis_auditoria_acceso"
          campoPrimario="ide_auac"
          opcionesColumnas={[
            {
              nombre: 'ide_usua',
              combo: {
                nombreTabla: 'sis_usuario',
                campoPrimario: 'ide_usua',
                campoNombre: 'nom_usua',
                condicion: 'activo_usua = true'
              }
            },
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
              lectura: true,
              width: 10
            },
            {
              nombre: 'fin_auac',
              valorDefecto: true
            }
          ]}
        />
      </Container>
    </Page>
  );
}
