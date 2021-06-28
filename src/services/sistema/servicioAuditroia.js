import { llamarServicioPost } from '../servicioBase';

/**
 * Llama al servicio borrarAuditoria
 * @returns
 */
export const borrarAuditoria = async () => llamarServicioPost('api/seguridad/borrarAuditoria');
