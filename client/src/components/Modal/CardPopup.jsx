import React from 'react'

const CardPopup = ({ card, onClose }) => {
  return (
    <div className="card-popup">
      <div className="close-btn__wrapper" onClick={onClose}>
        <div className="close-btn__bar bar1"></div>
        <div className="close-btn__bar bar2"></div>
      </div>
      <img src={card.image} className="card-nft" alt="card-nft" />
    </div>
  )
}

export default CardPopup