/**
 * Hook para obtener las dimenciones del navegador
 * Fecha Creación: 07-07-2021
 * Author: DFJG
 */
import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

const useWidth = () => {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();

  /**
   * Retorna el ancho de la pantalla lg, md, xs
   */
  const width =
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs';

  /**
   * Retorna si la pantalla es de teloefono mobil
   */
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return { width, isMobile };
};

export default useWidth;
