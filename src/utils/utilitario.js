export function isDefined(_variable) {
  return typeof _variable !== 'undefined' && _variable !== null;
}

export function isEmpty(_variable) {
  return isDefined && _variable === '';
}

export function isNumber(valor) {
  const rxLive = /^[+-]?\d*(?:[.,]\d*)?$/;
  return rxLive.test(valor);
}

export function toCapitalize(str) {
  str = str.toLowerCase();
  console.log(str.charAt(0).toUpperCase() + str.slice(1));
  return str.charAt(0).toUpperCase() + str.slice(1);
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
    const encontro = busquedaRecursivaIdeOpci(opciActual, ruta);
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
function busquedaRecursivaIdeOpci(opcion, ruta) {
  if (opcion.ruta === ruta) {
    return opcion.data;
  }
  if (opcion.items) {
    for (let i = 0; i < opcion.items.length; i += 1) {
      const opciActual = opcion.items[i];
      const encontro = busquedaRecursivaIdeOpci(opciActual, ruta);
      if (encontro !== null) {
        return encontro;
      }
    }
  }

  return null;
}
