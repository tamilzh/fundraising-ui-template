import React from 'react'

const HowUniquePopup = ({ item, onClose }) => {
  const showTitle = () => {
    if (item.link && item.link.length > 0) {
      return (
        <a href={item.link} target="_blank" rel="noreferrer">
          {item.title}
        </a>
      );
    }
    return item.title;
  };
  return (
    <div className="how-unique__card">
      <div className="close-btn__wrapper" onClick={onClose}>
        <div className="close-btn__bar bar1"></div>
        <div className="close-btn__bar bar2"></div>
      </div>
      <div className="how-unique__card-icon-box">
        <img className="how-unique__card-icon" src={item.icon} alt="icon"></img>
      </div>
      <h1 className="how-unique__card-title">{showTitle()}</h1>
      <p
        className="how-unique__card-desc"
        dangerouslySetInnerHTML={{ __html: item.desc }}
      ></p>
    </div>
  );
};

export default HowUniquePopup