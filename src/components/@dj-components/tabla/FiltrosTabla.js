import React from 'react';
import PropTypes from 'prop-types';

// Define a default UI for filtering
export function DefaultColumnFilter({ column }) {
  return (
    <input
      value={column.filterValue || ''}
      onChange={(e) => {
        column.setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
    />
  );
}

DefaultColumnFilter.propTypes = {
  column: PropTypes.object.isRequired
};
