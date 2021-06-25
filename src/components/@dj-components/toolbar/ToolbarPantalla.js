import PropTypes from 'prop-types';
// material
import { Stack } from '@material-ui/core';

// ----------------------------------------------------------------------

ToolbarPantalla.propTypes = {
  justifyContent: PropTypes.oneOf(['flex-end', 'flex-start']),
  componentes: PropTypes.node
};

export default function ToolbarPantalla({ componentes, justifyContent = 'flex-start' }) {
  return (
    <Stack mb={5} direction="row" justifyContent={justifyContent} spacing={1.5}>
      {componentes}
    </Stack>
  );
}
