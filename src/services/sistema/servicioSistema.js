import axios from '../../utils/axios';

/**
 * Llama al servicio consultarTabla
 * @param {string} nombreTabla
 * @param {string} campoPrimario
 * @param {string} campoOrden
 * @param {Array} condiciones
 * @param {number} filas
 * @param {number} pagina
 * @returns
 */
export const consultarTabla = async (
  nombreTabla,
  campoPrimario,
  campoOrden,
  condiciones,
  filas = null,
  pagina = null
) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  campoOrden = campoOrden.toLowerCase(); // pg estandar para tablas
  campoPrimario = campoPrimario.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campoPrimario,
    campoOrden,
    condiciones,
    filas,
    pagina
  };
  return axios.post('/api/sistema/consultarTabla', body);
};

/**
 * Llama al servicio getColumnasTabla
 * @param {string} nombreTabla
 * @param {string} campoPrimario
 * @param {string} ide_opci
 * @param {number} numero_tabl
 * @returns
 */
export const getColumnasTabla = async (nombreTabla, campoPrimario, ideOpci, numeTabla) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campoPrimario,
    ide_opci: ideOpci,
    numero_tabl: numeTabla
  };
  return axios.post('api/sistema/getColumnas', body);
};

/**
 * Llama al servicio getComboTabla
 * @param {string} nombreTabla
 * @param {string} campoPrimario
 * @param {string} campoNombre
 * @param {string} condicion
 * @returns
 */
export const getComboTabla = async (nombreTabla, campoPrimario, campoNombre, condicion = null) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  campoPrimario = campoPrimario.toLowerCase(); // pg estandar para tablas
  campoNombre = campoNombre.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campoPrimario,
    campoNombre,
    condicion
  };
  return axios.post('api/sistema/getCombo', body);
};

/**
 *
 * @param {string} nombreTabla
 * @param {string} campoPrimario
 * @param {any} valorCampoPrimario
 * @returns
 */
export const isEliminar = async (nombreTabla, campoPrimario, valorCampoPrimario) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  campoPrimario = campoPrimario.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campoPrimario,
    valorCampoPrimario
  };
  return axios.post('api/sistema/isEliminar', body);
};

/**
 *
 * @param {Array} listaSQL
 * @returns
 */
export const ejecutarListaSQL = async (listaSQL) => {
  const body = {
    listaSQL
  };
  return axios.post('api/sistema/ejecutarLista', body);
};

/**
 *
 * @param {string} nombreTabla
 * @param {string} campo
 * @param {any} valorCampo
 * @returns
 */
export const isUnico = async (nombreTabla, campo, valorCampo) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  campo = campo.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campo,
    valorCampo
  };
  return axios.post('api/sistema/isUnico', body);
};

/**
 *
 * @param {string} nombreTabla
 * @param {string} campoPrimario
 * @param {nummber} numeroFilas
 * @returns
 */
export const getMaximo = async (nombreTabla, campoPrimario, numeroFilas) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  campoPrimario = campoPrimario.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campoPrimario,
    numeroFilas
  };
  return axios.post('api/sistema/getMaximo', body);
};

/**
 *
 * @param {string} nombreTabla
 * @param {string} campoPrimario
 * @param {string} campoNombre
 * @param {string} campoPadre
 * @param {string} campoOrden
 * @param {Array} condiciones
 * @returns
 */
export const consultarArbol = async (nombreTabla, campoPrimario, campoNombre, campoPadre, campoOrden, condiciones) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  campoPrimario = campoPrimario.toLowerCase(); // pg estandar para tablas
  campoNombre = campoNombre.toLowerCase(); // pg estandar para tablas
  campoOrden = campoOrden.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campoOrden,
    condiciones,
    campoPrimario,
    campoNombre,
    campoPadre
  };
  return axios.post('api/sistema/consultarArbol', body);
};

/**
 *
 * @param {string} ideOpci
 * @param {*} tabla
 * @param {Array} columnas
 * @returns
 */
export const configurarTabla = async (ideOpci, tabla, columnas) => {
  // const tabConf = new Tabla();
  // tabConf.numeroTabla = tabla.numeroTabla;
  // tabConf.nombreTabla = tabla.nombreTabla;
  // tabConf.campoPrimario = tabla.campoPrimario;
  // tabConf.campoNombre = tabla.campoNombre;
  // tabConf.campoForanea = tabla.campoForanea;
  // tabConf.campoPadre = tabla.campoPadre;
  // tabConf.campoOrden = tabla.campoOrden;
  // tabConf.numeroFilas = tabla.numeroFilas;
  // tabConf.tipoFormulario = tabla.tipoFormulario;
  // tabConf.calculaPrimaria = tabla.calculaPrimaria;
  const body = {
    ide_opci: ideOpci,
    tabla,
    columnas
  };
  return axios.post('api/sistema/configurar', body);
};

/**
 *
 * @param {string} ideTabl
 * @returns
 */
export const eliminarConfiguracionTabla = async (ideTabl) => {
  const body = {
    ide_tabl: ideTabl
  };
  return axios.post('api/sistema/eliminarConfiguracion', body);
};

/**
 *
 * @param {string} ideOpci
 * @param {string} numeroTabla
 * @returns
 */
export const getConfiguracion = async (ideOpci, numeroTabla) => {
  const body = {
    ide_opci: ideOpci,
    numero_tabl: numeroTabla
  };
  return axios.post('api/sistema/getConfiguracion', body);
};

/**
 *
 * @param {string} longitud
 * @param {string} latitud
 * @returns
 */
export const getDatosClima = async (longitud, latitud) => {
  const body = {
    longitud,
    latitud
  };
  return axios.post('api/sistema/getDatosClima', body);
};

/**
 *
 * @returns
 */
export const importarParametros = async () => axios.post('api/sistema/importarParametros');
