import moment from "moment";
import React from "react";

const WidgetCard = ({ link, widgetCard, overlayText, type }) => {
  let time =
    (widgetCard.lastBoughtAt
      ? widgetCard.lastBoughtAt
      : widgetCard.metadata.mintedAt) * 1000;
  let date = new Date(time);
  let dateArray = [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  const showOverlayText = () => {
    if (overlayText) {
      return <h3 className="card__img-overlay-text">For Sale</h3>;
    }
  };

  const getFundedByNFT = (type) => {
    switch (type) {
      case "beneficiary":
        return widgetCard.totalByBeneficiary;
      case "sponsor":
        return widgetCard.totalByFundraiser;
      case "artist":
        return widgetCard.totalByArtist;
      default:
        return 0;
    }
  };

  return (
    <div
      className="widget-card"
      onClick={() => window.open(`${link}`, "_blank")}
    >
      <div className="widget-card__top-box">
        <img
          className="widget-card__img"
          src={widgetCard.metadata.image}
          alt="catdrop"
        ></img>
        {showOverlayText()}
      </div>
      <div className="widget-card__bottom-box">
        <div className="widget-card__body">
          <div className="widget-card__title">
            {Math.round(getFundedByNFT(type) * 100) / 100} AVAX Raised
          </div>
          <div className="widget-card__subtitle">
            {moment(dateArray).fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetCard;
