/**
 * Hook para obtener las dimenciones del navegador
 * Fecha Creación: 07-07-2021
 * Author: DFJG
 */
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

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

  const isFullWidth = useMediaQuery(theme.breakpoints.down('md'));

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return { width, isMobile, windowSize, isFullWidth };
};

export default useWidth;
