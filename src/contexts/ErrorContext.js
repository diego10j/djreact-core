import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import DialogoError from '../components/@dj-components/dialogo/DialogoError';

const ModalErrorContext = React.createContext();
const Modal = ({ modal, unSetModal }) => (
  <DialogoError mensaje={modal.mensaje} titulo={modal.titulo} unSetModal={unSetModal} />
);
Modal.propTypes = {
  modal: PropTypes.object,
  unSetModal: PropTypes.func
};

const ModalErrorProvider = (props) => {
  const [modal, setModal] = useState();
  const unSetModal = useCallback(() => {
    setModal();
  }, [setModal]);

  return (
    <ModalErrorContext.Provider value={{ unSetModal, setModal }} {...props}>
      {props.children}
      {modal && <Modal modal={modal} unSetModal={unSetModal} />}
    </ModalErrorContext.Provider>
  );
};

ModalErrorProvider.propTypes = {
  children: PropTypes.node
};

const useModalError = () => {
  const context = React.useContext(ModalErrorContext);
  if (context === undefined) {
    throw new Error('useModalError must be used within a UserProvider');
  }
  return context;
};

export { ModalErrorProvider, useModalError };
