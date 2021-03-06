/**
 * Hook para objetos Tabla de tipo formulario
 * Fecha Creación: 22-06-2021
 * Author: DFJG
 */
import { useState } from 'react';
import { isDefined } from '../utils/utilitario';

const useForm = (_validationSchema) => {
  const validationSchema = _validationSchema;
  const [values, setValues] = useState({}); // Almacena los valores de la fila seleccionada

  const [configuracion, setConfiguracion] = useState({}); // Almacena la configuracion de la tabla

  /**
   * Recupera los errores del formulario y pinta los campos de texto con el error
   * @param {*} validationSchema
   * @param {*} values
   */
  const erroresValidacion = () => {
    if (isDefined(validationSchema && isDefined(values))) {
      validationSchema.validate(values, { abortEarly: false }).catch((err) => {
        err.inner.forEach((e) => {
          // console.log(`${e.path} ${e.message}`);
          if (e.path) {
            document.getElementById(e.path).focus();
            document.getElementById(e.path).blur();
          }
        });
      });
    }
  };
  /**
   * Verifica que el esquema sea válido
   * @param {*} validationSchema
   * @param {*} values
   * @returns
   */
  const isValid = async () => {
    if (isDefined(validationSchema && isDefined(values))) {
      const resp = await validationSchema.isValid(values);
      return resp;
    }
    return true;
  };

  return { validationSchema, isValid, erroresValidacion, setValues, values, configuracion, setConfiguracion };
};

export default useForm;
