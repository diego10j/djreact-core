import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { alpha, makeStyles, withStyles } from '@material-ui/core/styles';
// material
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import SvgIcon from '@material-ui/core/SvgIcon';
// hooks
import useMensaje from '../../../hooks/useMensaje';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// utils
import { isDefined } from '../../../utils/utilitario';
// servicios
import { consultarArbol } from '../../../services/sistema/servicioSistema';

// ----------------------------------------------------------------------

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <circle cx="10" cy="10" r="2" stroke="black" strokeWidth="3" fill="black" />
    </SvgIcon>
  );
}

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    '& .close': {
      opacity: 0.3
    }
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`
  }
}))((props) => <TreeItem {...props} />);

const useStyles = makeStyles({
  root: {
    height: '100%',
    flexGrow: 1,
    maxWidth: '100%'
  }
});

const Arbol = forwardRef(
  (
    { titulo = 'Raiz', nombreTabla, campoPrimario, campoNombre, campoPadre, campoOrden, condiciones, ...other },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      configuracion
    }));

    const [data, setData] = useState([]);

    const [configuracion, setConfiguracion] = useState({
      nombreTabla,
      campoPrimario,
      campoNombre,
      campoPadre,
      campoOrden,
      condiciones
    });

    /**
     * Sirve para las pantallas genéricas, cuando cambia la configuración de componentes Tabla
     */
    useEffect(() => {
      getServicioArbol();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const { showError } = useMensaje();

    /**
     * Obtiene las columnas del servicio web
     */
    const getServicioArbol = async () => {
      // console.log('---CARGA COLUMNAS');
      try {
        const { data } = await consultarArbol(
          configuracion.nombreTabla,
          configuracion.campoPrimario,
          configuracion.campoNombre,
          configuracion.campoPadre,
          configuracion.campoOrden,
          configuracion.condiciones
        );
        if (isMountedRef.current) {
          setData({
            data: 'root',
            label: titulo,
            children: data.datos
          });
        }
      } catch (error) {
        console.log(error);
        showError(error.mensaje);
      }
    };

    const renderTree = (nodes) => (
      <StyledTreeItem key={nodes.data} nodeId={nodes.data} label={nodes.label}>
        {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
      </StyledTreeItem>
    );

    return (
      <>
        <TreeView
          className={classes.root}
          defaultExpanded={['root']}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={<CloseSquare />}
        >
          {renderTree(data)}
        </TreeView>
      </>
    );
  }
);

Arbol.propTypes = {
  nombreTabla: PropTypes.string,
  campoPrimario: PropTypes.string,
  campoNombre: PropTypes.string,
  campoPadre: PropTypes.string,
  campoOrden: PropTypes.string,
  condiciones: PropTypes.string
};

export default Arbol;
