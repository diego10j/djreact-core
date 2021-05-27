import { format, formatDistanceToNow } from 'date-fns';
import moment from 'moment';
import { isDefined } from './utilitario';
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
export function toDate(fecha, formato = 'DD/MM/YYYY') {
  if (isDefined(fecha)) {
    return moment(fecha, formato).toDate();
  }
  return null;
}

/**
 * Transforma una hora string hh:mm:ss a Date
 * @param hora  en string
 */
export function toHoraDate(hora) {
  if (isDefined(hora)) {
    return moment(`2021-01-01 ${hora}`, 'YYYY-MM-DD HH:mm:ss').toDate();
  }
  return null;
}

/**
 * Retorna si es una fecha es válida
 * @param fecha
 * @param formato
 */
export function isFechaValida(fecha, formato = 'DD/MM/YYYY') {
  return moment(fecha, formato).isValid();
}

/**
 * Retorna un string de la fecha en formato (DD/MM/YYYY por defecto)
 * @param fecha Date
 */
export function getFormatoFecha(fecha, formato = 'DD/MM/YYYY') {
  if (isDefined(fecha) && isDate(fecha)) {
    return moment(fecha).format(formato.toUpperCase());
  }
  return null;
}

/**
 * Retorna un string de la hora en formato HH:mm:ss
 * @param fecha Date
 */
export function getFormatoHora(hora, formato = 'HH:mm:ss') {
  if (isDefined(hora) && isDate(hora)) {
    return moment(hora).format(formato);
  }
  return null;
}

/**
 * Valida si la variable es de tipo Date
 * @param {*} date
 * @returns
 */
export function isDate(date) {
  return date && Object.prototype.toString.call(date) === '[object Date]';
}
