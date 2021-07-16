import React, { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
// material
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
// utils
import { isDefined, toCapitalize } from '../../../utils/utilitario';
// ----------------------------------------------------------------------

const Arbol = forwardRef(({ valorInicial, onChange, label = '', ...other }, ref) => {
  useImperativeHandle(ref, () => ({
    renderTree
  }));
  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree([])}
    </TreeView>
  );
});

Arbol.propTypes = {
  valorInicial: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  label: PropTypes.string,
  onChange: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default Arbol;
