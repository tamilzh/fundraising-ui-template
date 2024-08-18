import React from 'react'

const Error = ({err, onClose}) => {
  return (
    <div className='error-wrapper'>
        <h3 className='error-text'>{err}</h3>
        <button className='error-btn' onClick={onClose}>OK</button>
    </div>
  )
}

export default Error