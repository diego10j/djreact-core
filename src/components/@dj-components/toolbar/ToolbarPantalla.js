import PropTypes from 'prop-types';
// material
import { Stack } from '@mui/material';

// ----------------------------------------------------------------------

ToolbarPantalla.propTypes = {
  justifyContent: PropTypes.oneOf(['flex-end', 'flex-start']),
  componentes: PropTypes.node
};

export default function ToolbarPantalla({ componentes, justifyContent = 'flex-start' }) {
  return (
    <Stack mb={2} direction="row" alignItems="center" justifyContent={justifyContent} spacing={2}>
      {componentes}
    </Stack>
  );
}
