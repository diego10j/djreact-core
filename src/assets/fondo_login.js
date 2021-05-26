// material
import { useTheme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function FondoLogin({ ...other }) {
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.light;
  return (
    <Box {...other}>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="1000.000000pt"
        viewBox="0 0 750.000000 1000.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(0.000000,1000.000000) scale(0.100000,-0.100000)" fill={PRIMARY_MAIN} stroke="none">
          <path
            d="M0 5000 l0 -5000 2600 0 2600 0 -5 23 c-2 12 -23 128 -45 257 -57
               326 -125 689 -161 850 -190 858 -527 1646 -982 2295 -286 408 -584 764 -1252
               1495 -633 694 -833 922 -1098 1254 -499 627 -823 1212 -1070 1932 -148 430
               -230 784 -363 1557 l-58 337 -83 0 -83 0 0 -5000z"
          />
        </g>
      </svg>
    </Box>
  );
}
