import React from "react";

const SimpleCard = ({ simpleCard, overlayText }) => {
  const showOverlayText = () => {
    if (overlayText) {
      return <h3 className="card__img-overlay-text">For Sale</h3>;
    }
  };

  return (
    <div className="simple-card">
      <div className="simple-card__top-box">
        <img
          className="simple-card__img"
          src={simpleCard.image}
          alt="Catdrop"
        ></img>
        {showOverlayText()}
      </div>
      <div className="simple-card__bottom-box">
        <div className="simple-card__body">
          <h3 className="simple-card__title">{simpleCard.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default SimpleCard;
