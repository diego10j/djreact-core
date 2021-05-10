export default class Columna {
  constructor(nombre) {
    this.nombre = nombre;
    this.nombreVisual = nombre;
    this.requerida = false;
    this.visible = true;
    this.lectura = true;
    this.valorDefecto = null;
    this.filtro = false;
    this.mayusculas = false;
    this.alinear = 'izquierda';
    this.ordenable = true;
    this.resizable = true;
    this.orden = 0;
    this.anchoColumna = 10;
  }

  setLectura(lectura) {
    this.lectura = lectura;
  }

  setVisble(visible) {
    this.visible = visible;
  }
}
