import { useRef, useState } from 'react';

// material
import { Container, Card, TableContainer } from '@material-ui/core';
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
import usePantalla from '../../hooks/usePantalla';
import { getFechaActual } from '../../utils/formatTime';

// ----------------------------------------------------------------------

export default function Simple() {
  const pantalla = usePantalla();
  const tabTabla1 = useRef();
  const tabTabla2 = useRef();
  const [isGuardar, setIsGuardar] = useState(false);

  const guardar = async () => {
    setIsGuardar(true);
    if (await tabTabla1.current.isGuardar()) {
      pantalla.guardar(tabTabla1);
    }
    setIsGuardar(false);
  };

  return (
    <Page title="Simple">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Simple"
          links={[{ name: 'Sistema', href: PATH_DASHBOARD.root }, { name: 'Simple' }]}
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
        <Card>
          <TableContainer sx={{ padding: 2 }}>
            <Tabla
              ref={tabTabla1}
              numeroTabla={1}
              lectura={false}
              nombreTabla="sis_auditoria_acceso"
              campoPrimario="ide_auac"
              showRowIndex
              opcionesColumnas={[
                {
                  nombre: 'ide_usua',
                  filtro: true,
                  combo: {
                    nombreTabla: 'sis_usuario',
                    campoPrimario: 'ide_usua',
                    campoNombre: 'nom_usua',
                    condicion: 'activo_usua = true'
                  }
                },
                {
                  nombre: 'FECHA_AUAC',
                  valorDefecto: getFechaActual()
                },
                {
                  nombre: 'IDE_ACAU',
                  filtro: true,
                  combo: {
                    nombreTabla: 'sis_accion_auditoria',
                    campoPrimario: 'IDE_ACAU',
                    campoNombre: 'nom_ACAU'
                  }
                },
                {
                  nombre: 'detalle_auac',
                  nombreVisual: 'DETALLE',
                  ordenable: false,
                  filtro: true,
                  requerida: true,
                  orden: 0
                },
                {
                  nombre: 'ip_auac',
                  nombreVisual: 'IP',
                  filtro: true,
                  lectura: true,
                  width: 160
                },
                {
                  nombre: 'fin_auac',
                  valorDefecto: true
                }
              ]}
            />
          </TableContainer>
        </Card>

        <Card sx={{ mt: 5 }}>
          <TableContainer sx={{ padding: 2 }}>
            <Tabla
              ref={tabTabla2}
              filasPorPagina={20}
              numeroTabla={2}
              nombreTabla="sis_auditoria_acceso"
              campoPrimario="ide_auac"
              compoOrden="detalle_auac"
              opcionesColumnas={[
                {
                  nombre: 'ide_usua',
                  filtro: true,
                  combo: {
                    nombreTabla: 'sis_usuario',
                    campoPrimario: 'ide_usua',
                    campoNombre: 'nom_usua',
                    condicion: 'activo_usua = true'
                  }
                },
                {
                  nombre: 'IDE_ACAU',
                  filtro: true,
                  combo: {
                    nombreTabla: 'sis_accion_auditoria',
                    campoPrimario: 'IDE_ACAU',
                    campoNombre: 'nom_ACAU'
                  }
                },
                {
                  nombre: 'detalle_auac',
                  nombreVisual: 'DETALLE',
                  ordenable: false,
                  filtro: true
                },
                {
                  nombre: 'ip_auac',
                  nombreVisual: 'IP',
                  width: 160
                }
              ]}
            />
          </TableContainer>
        </Card>
      </Container>
    </Page>
  );
}
