import React from 'react';

const Button = ({show, onOpen}) => {
  return (
    <button className='btnn' onClick={onOpen}>{show ? 'Close Modal' : 'Open Modal'}</button>
  );
};

export default Button;