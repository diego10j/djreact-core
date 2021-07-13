export function isDefined(_variable) {
  return typeof _variable !== 'undefined' && _variable !== null;
}

export function isEmpty(_variable) {
  return !isDefined(_variable) || _variable === '';
}

export function isNumber(valor) {
  const rxLive = /^[+-]?\d*(?:[.,]\d*)?$/;
  return rxLive.test(valor);
}

export function toCapitalize(str) {
  // str = str.toLowerCase();
  // return str.charAt(0).toUpperCase() + str.slice(1);
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ');
}

/**
 * Retorna las iniciales de un nombre
 * @param {string} nombre
 * @returns
 */
export function inicialesAvatar(nombre) {
  let letras = '';
  if (isDefined(nombre)) {
    letras = nombre.charAt(0);
    if (nombre.indexOf(' ') !== -1) {
      nombre = nombre.substring(nombre.indexOf(' ') + 1, nombre.length);
      letras += nombre.charAt(0);
    }
  }
  return letras;
}

/**
 * Calucla un color de acuerdo al string
 * @param {*} string
 * @returns
 */
export function stringToColorAvatar(string) {
  let color = '#fefefe';
  if (isDefined(string)) {
    let hash = 0;
    let i;
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
  }
  return color;
}

/**
 *  Optine las coordenadas geográficas
 * @returns
 */
export const getGeoLocalizacion = () => {
  if (navigator && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { coords } = pos;
      return {
        latitud: coords.latitude,
        longitud: coords.longitude
      };
    });
  }
  // por defecto
  return {
    longitud: -78.5248,
    latitud: -0.225219
  };
};

/**
 * Retorna el ide_opci de una ruta
 * @param {*} ruta
 * @returns
 */
export const getIdeOpci = (ruta = null) => {
  if (!isDefined(ruta)) {
    ruta = window.location.href;
    ruta = ruta.substring(ruta.lastIndexOf('/') + 1, ruta.length);
  }

  if (ruta.includes('generic_')) {
    // Para pantallas genericas
    const data = ruta.substring(ruta.lastIndexOf('_') + 1, ruta.length);
    return data;
  }
  if (isNumber(ruta)) {
    // Para pantallas que recieben 1 parametro id
    ruta = window.location.href;
    ruta = ruta.substring(0, ruta.lastIndexOf('/'));
    ruta = ruta.substring(ruta.lastIndexOf('/') + 1, ruta.length);
  }
  const menu = JSON.parse(localStorage.getItem('menu')) || [];
  // Busqueda recursiva
  for (let i = 0; i < menu.length; i += 1) {
    const opciActual = menu[i];
    const encontro = busquedaRecursivaMenu(opciActual, ruta);
    if (encontro !== null) {
      return encontro;
    }
  }
  return null;
};

/**
 * Busqueda recursiva en el menu del usuario
 * @param {*} opcion
 * @param {*} ruta
 * @returns
 */
function busquedaRecursivaMenu(opcion, ruta, element = 'data') {
  if (opcion.ruta === ruta) {
    return opcion[element];
  }
  if (opcion.items) {
    for (let i = 0; i < opcion.items.length; i += 1) {
      const opciActual = opcion.items[i];
      const encontro = busquedaRecursivaMenu(opciActual, ruta, element);
      if (encontro !== null) {
        return encontro;
      }
    }
  }
  return null;
}

export const getTituloPantalla = (ruta = null) => {
  if (!isDefined(ruta)) {
    ruta = window.location.href;
    ruta = ruta.substring(ruta.lastIndexOf('dashboard') + 10, ruta.length);
    ruta = ruta.substring(ruta.indexOf('/') + 1, ruta.length);
  }
  const menu = JSON.parse(localStorage.getItem('menu')) || [];
  // Busqueda recursiva
  for (let i = 0; i < menu.length; i += 1) {
    const opciActual = menu[i];
    const encontro = busquedaRecursivaMenu(opciActual, ruta, 'label');
    if (encontro !== null) {
      return encontro;
    }
  }
  return 'Título de la Pantalla';
};
