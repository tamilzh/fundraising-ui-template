import React from 'react';

const Modal = ({children, show, type}) => {
  // const modalClass = show ? 'modal d-block' : 'modal d-none';
  const modalClass = type === "warn" && show ? 'warn-modal' : show ? 'modal d-block' : 'modal d-none';;
  return (
    <div className={modalClass}>
      {children}  
    </div>
  )
};

export default Modal;