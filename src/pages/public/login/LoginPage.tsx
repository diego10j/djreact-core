import { IonContent, IonPage } from "@ionic/react";
import { useRef } from "react";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  //Componente Mutable
  const containerRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const handleCambiaLogin = () => {
    containerRef.current.classList.add("sign-up-mode");
  };

  const handleCambiaRegistrar = () => {
    containerRef.current.classList.remove("sign-up-mode");
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="container" ref={containerRef}>
          <div className="forms-container">
            <div className="signin-signup">
              <form action="#" className="sign-in-form">
                <h2 className="title">Iniciar Sesión</h2>
                <div className="separator"></div>
                <div className="input-field">
                  <i className="fa fas fa-user"></i>
                  <input type="text" placeholder="Usuario" />
                </div>
                <div className="input-field">
                  <i className="fa fas fa-lock"></i>
                  <input type="password" placeholder="Contraseña" />
                </div>
                <input type="submit" value="Login" className="btn solid" />
              </form>

              <form action="#" className="sign-up-form">
                <h2 className="title">Regístrate ahora</h2>
                <div className="separator"></div>
                <div className="input-field">
                  <i className="fa far fa-id-card"></i>
                  <input type="text" placeholder="Cédula o RUC" />
                </div>
                <div className="input-field">
                  <i className="fa fas fa-user"></i>
                  <input type="text" placeholder="Nombre Completo" />
                </div>
                <div className="input-field">
                  <i className="fa fas fa-envelope"></i>
                  <input type="email" placeholder="Email" />
                </div>
                <div className="input-field">
                  <i className="fa fas fa-lock"></i>
                  <input type="password" placeholder="Contraseña" />
                </div>
                <div className="input-field">
                  <i className="fa fas fa-lock"></i>
                  <input type="password" placeholder="Confirmar Contraseña" />
                </div>
                <input type="submit" className="btn" value="Aceptar" />
              </form>
            </div>
          </div>

          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>¿No tienes cuenta?</h3>
                <p></p>
                <button
                  className="btn transparent"
                  id="sign-up-btn"
                  onClick={handleCambiaLogin}
                >
                  Registrarse
                </button>
              </div>
              <img src="./assets/svg/login.svg" className="image" alt="" />
            </div>
            <div className="panel right-panel">
              <div className="content">
                <h3>¿Ya tienes cuenta?</h3>
                <p></p>
                <button
                  className="btn transparent"
                  id="sign-in-btn"
                  onClick={handleCambiaRegistrar}
                >
                  Iniciar sesión
                </button>
              </div>
              <img src="./assets/svg/registro.svg" className="image" alt="" />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
