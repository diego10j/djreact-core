/**
 * Hook para objetos Tabla de tipo formulario
 * Fecha Creación: 22-06-2021
 * Author: DFJG
 */
const useForm = () => {
  /**
   * Recupera los errores del formulario y pinta los campos de texto con el error
   * @param {*} validationSchema
   * @param {*} filaSeleccionada
   */
  const erroresValidacion = (validationSchema, filaSeleccionada) => {
    validationSchema.validate(filaSeleccionada, { abortEarly: false }).catch((err) => {
      err.inner.forEach((e) => {
        // console.log(`${e.path} ${e.message}`);
        if (e.path) {
          document.getElementById(e.path).focus();
          document.getElementById(e.path).blur();
        }
      });
    });
  };
  /**
   * Verifica que el esquema sea válido
   * @param {*} validationSchema
   * @param {*} filaSeleccionada
   * @returns
   */
  const isValid = async (validationSchema, filaSeleccionada) => {
    await validationSchema.isValid(filaSeleccionada);
  };

  return { isValid, erroresValidacion };
};

export default useForm;
