import { format, formatDistanceToNow } from 'date-fns';
import moment from 'moment';
import { isDefined } from './utilitario';
import { formatosFecha } from '../config';
import 'moment/locale/es';
// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true
  });
}

/**
 * Transforma a Date una fecha string
 * @param fecha  en string
 * @param formato de la fecha
 */
export function toDate(fecha, formato = formatosFecha.FORMATO_FECHA_FRONT) {
  if (isDefined(fecha)) {
    return moment(fecha, formato).toDate();
  }
  return null;
}

/**
 * Transforma una hora string hh:mm:ss a Date
 * @param hora  en string
 */
export function toHora(hora) {
  if (isDefined(hora)) {
    return moment(`01/01/2021 ${hora}`, formatosFecha.FORMATO_FECHA_HORA_FRONT).toDate();
  }
  return null;
}

/**
 * Retorna si es una fecha es válida
 * @param fecha
 * @param formato
 */
export function isFechaValida(fecha, formato = formatosFecha.FORMATO_FECHA_FRONT) {
  //  return isDefined(fecha) && fecha.length === formato.length.length && moment(fecha, formato).isValid();
  return moment(fecha, formato).isValid();
}

/**
 * Retorna un string de la fecha en formato (DD/MM/YYYY por defecto)
 * @param fecha Date
 */
export function getFormatoFecha(fecha, formato = formatosFecha.FORMATO_FECHA_FRONT) {
  if (isDefined(fecha)) {
    if (isFechaValida(fecha, formato)) return moment(toDate(fecha)).format(formato);
  }
  return null;
}

export function getFormatoFechaHora(fecha, formato = formatosFecha.FORMATO_FECHA_HORA_FRONT) {
  return getFormatoFecha(fecha, formato);
}

/**
 * Retorna la fecha en formato soportado por la base de datos
 * @param {Date} fecha
 * @returns
 */
export function getFormatoFechaBDD(fecha) {
  return getFormatoFecha(fecha, formatosFecha.FORMATO_FECHA_BD);
}

/**
 * Retorna un string de la hora en formato HH:mm:ss
 * @param fecha Date
 */
export function getFormatoHora(hora, formato = formatosFecha.FORMATO_HORA) {
  if (isDefined(hora)) {
    if (moment(hora, formato).isValid()) return moment(hora, formato).format(formato);
  }
  return null;
}

/**
 * Retorna la fecha actual, formato por defecto DD/MM/YYYY
 * @param {String} formato
 * @returns
 */
export function getFechaActual(formato = formatosFecha.FORMATO_FECHA_FRONT) {
  return getFormatoFecha(new Date(), formato);
}

/**
 * Retorna una fecha en el formato enviado
 * @param {*} fecha
 * @param {*} format
 * @param {*} formatoFecha
 * @returns
 */
export function getFormatoMoment(fecha, format, formatoFecha = 'YYYY-MM-DD h:mm:ss') {
  return moment(fecha, formatoFecha).format(format);
}

/**
 * Valida si la variable es de tipo Date
 * @param {*} date
 * @returns
 */
export function isDate(date) {
  // console.log(Object.prototype.toString.call(date));
  return date && Object.prototype.toString.call(date) === '[object Date]';
}
