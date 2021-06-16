// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  kanban: getIcon('ic_kanban')
};

const getMenuOpciones = () => {
  const menuUsuario = JSON.parse(localStorage.getItem('menu')) || [];
  const menu = [
    {
      subheader: 'General',
      items: [
        {
          title: 'Dashboard',
          path: PATH_DASHBOARD.general.app,
          icon: ICONS.dashboard
        },
        { title: 'Calendario', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar }
      ]
    }
  ];
  const hijos = [];
  for (let i = 0; i < menuUsuario.length; i += 1) {
    const opcionActual = menuUsuario[i];
    const itemsOpcion = [];
    if (opcionActual.items) {
      for (let j = 0; j < opcionActual.items.length; j += 1) {
        const itemActual = opcionActual.items[j];
        itemsOpcion.push({
          title: itemActual.label,
          path: `/dashboard/${itemActual.paquete}/${itemActual.ruta}`
        });
      }
    }
    hijos.push({
      title: opcionActual.label,
      path: `/dashboard/${opcionActual.paquete}`,
      icon: ICONS.kanban,
      children: itemsOpcion
    });
  }
  menu.push({
    subheader: 'Opciones',
    items: hijos
  });
  return menu;
};

export default getMenuOpciones;
