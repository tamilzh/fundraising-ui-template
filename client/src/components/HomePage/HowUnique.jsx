import React from "react";
import icon1 from "../../assets/images/how_they_are_unique_icons/icon1.png";
import icon2 from "../../assets/images/how_they_are_unique_icons/icon2.png";
import icon3 from "../../assets/images/how_they_are_unique_icons/icon3.png";
import icon4 from "../../assets/images/how_they_are_unique_icons/icon4.png";
import { useState } from "react";
import Modal from "../Modal/Modal";
import Popup from "../Modal/Popup";
import HowUniquePopup from "../Modal/HowUniquePopup";
import { NavLink } from "react-router-dom";
import constant from "../../utils/constant";

const howUniqueCards = [
  {
    id: 0,
    icon: icon1,
    title: process.env.REACT_APP_ABOUT_CARD_TITLE1,
    desc: process.env.REACT_APP_ABOUT_CARD_DESC1,
  },
  {
    id: 1,
    icon: icon2,
    title: process.env.REACT_APP_ABOUT_CARD_TITLE2,
    desc: process.env.REACT_APP_ABOUT_CARD_DESC2,
  },
  {
    id: 2,
    icon: icon3,
    title: process.env.REACT_APP_ABOUT_CARD_TITLE3,
    desc: process.env.REACT_APP_ABOUT_CARD_DESC3,
  },
  {
    id: 3,
    icon: icon4,
    title: process.env.REACT_APP_ABOUT_CARD_TITLE4,
    desc: process.env.REACT_APP_ABOUT_CARD_DESC4
  },
];
const HowUnique = () => {
  const [show, setShow] = useState(false);
  const [cardId, setCardId] = useState(0);

  const openModal = (index) => {
    setCardId(index);
    setShow(!show);
  };

  const closeModal = () => {
    setShow(!show);
  };

  return (
    <>
      <span className="link_wrapper" id="about"></span>
      <section className="how-unique default-settings gradient-bg">
        <h1 className="how-unique__title title-ds">{process.env.REACT_APP_ABOUT_TITLE}</h1>
        <h1 className="how-unique__title title-mb">{process.env.REACT_APP_ABOUT_TITLE}</h1>
        <div className="hr-line"></div>
        <p className="how-unique__desc">{process.env.REACT_APP_ABOUT_DESC}</p>
        <div className="how-unique__cards">
          {howUniqueCards.map((item) => (
            <div
              key={item.id}
              className="how-unique__card"
              onClick={() => openModal(item.id)}
            >
              <div className="how-unique__card-icon-box">
                <img
                  className={`how-unique__card-icon icon${item.id + 1}`}
                  src={item.icon}
                  alt="icon"
                ></img>
              </div>
              <h1 className="how-unique__card-title">{item.title}</h1>
              <div className="how-unique__card-btn">
                <span className="how-unique__card-btn-text">Learn More</span>
              </div>
            </div>
          ))}
        </div>
        {/*
        <NavLink to="/faqs" className="faqs-link-wrapper">
          <h3 className="faqs-link">More Answers to Common Questions</h3>
        </NavLink> */}
        <Modal show={show}>
          <Popup>
            <HowUniquePopup
              item={howUniqueCards[cardId]}
              onClose={closeModal}
            />
          </Popup>
        </Modal>
      </section>
    </>
  );
};

export default HowUnique;
