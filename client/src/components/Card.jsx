import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import share_icon from "../assets/images/share_icon.svg";
import AVVY from "@avvy/client";
import { ethers } from "ethers";
import constant from "../utils/constant";
import { getConstants } from "../utils/services";
import Modal from "./Modal/Modal";
import Popup from "./Modal/Popup";
import CardPopup from "./Modal/CardPopup";

const Card = ({
  card,
  btn,
  download,
  overlay,
  overlayText,
  newest,
  onBtnOpen,
  onPieOpen,
  onShare,
  isOwner,
  enableZoom = false,
}) => {
  const [showZoom, setShowZoom] = useState(false);
  const [popUpCard, setPopUpCard] = useState(0);
  const [tooltiptext, setTooltipText] = useState("Copy Address");
  const [address, setAddress] = useState("");
  const imgClass = overlay ? "card__img img-overlay" : "card__img";

  const download_btn_style = download
    ? { visibility: "visible" }
    : { visibility: "hidden" };

  const showType = () => {
    if (card.distPresetName) {
      return (
        <h4 className="card__text card__type">
          {card.distPresetName === "I Only Love Octopi"
            ? "I Only ❤️ Octopi"
            : card.distPresetName === "Art Lover"
            ? "🎨 Lover"
            : card.distPresetName === "Cat Lover"
            ? "🐱 Lover"
            : card.distPresetName}
        </h4>
      );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(card.address);
    setTooltipText("Copied");
  };

  useEffect(() => {
    const checkAddress = async () => {
      if (card.address) {
        const trunc_address = ` ${card.address.slice(
          0,
          6
        )}...${card.address.slice(card.address.length - 4)} `;
        const { NETWORK_URL } = await getConstants();
        const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
        const avvy = new AVVY(provider);
        const hash = await avvy.reverse(AVVY.RECORDS.EVM, card.address);
        if (hash != null) {
          const name = await hash.lookup();
          setAddress(name.name);
        } else {
          setAddress(trunc_address);
        }
      }
    };
    checkAddress();
    return () => {
      setAddress(null);
    };
  }, [card.address]);

  const showAddress = () => {
    if (address != "") {
      return (
        <div
          className="card__text card__addr tooltip"
          onClick={copyToClipboard}
          onMouseOut={() => setTooltipText("Copy Address")}
        >
          {address}
          <span className="tooltiptext">{tooltiptext}</span>
        </div>
      );
    }
  };

  const showButton = () => {
    if (btn) {
      return (
        <div>
          <button className="card__btn" onClick={() => onBtnOpen(card, btn)}>
            {btn}
          </button>
        </div>
      );
    } else {
      if (isOwner) {
        return (
          <div className="card__text card__addr tooltip">{constant.MY_NFT}</div>
        );
      }
    }
  };

  const showOverlayText = () => {
    if (overlayText) {
      return <h3 className="card__img-overlay-text">For Sale</h3>;
    }
  };

  const showNewest = () => {
    if (newest && card.mintedAt === newest) {
      return (
        <div className="ribbon">
          <span>Newest</span>
        </div>
      );
    }
  };
  const showNotForSale = () => {
    if (!card.forSale && isOwner !== undefined) {
      return (
        <div className="ribbon">
          <span>Not for sale</span>
        </div>
      );
    }
  };

  const openModal = (card) => {
    if (enableZoom) {
      setPopUpCard(card);
      setShowZoom(!showZoom);
    }
  };

  const closeModal = () => {
    setShowZoom(!showZoom);
  };

  const renderCardPopup = () => {
    return (
      <Modal show={showZoom}>
        <Popup>
          <CardPopup card={popUpCard} onClose={closeModal} />
        </Popup>
      </Modal>
    );
  };

  return (
    <>
      {renderCardPopup()}
      <div
        className="card"
        data-token={card?.tokenId}
        data-siteindex={card?.siteTokenIndex}
        onClick={() => openModal(card)}
      >
        <div className="card__top-box">
          <img className={imgClass} src={card.image} alt="NFT"></img>
          {showOverlayText()}
          {showNewest()}
          {showNotForSale()}
          <div
            className="card__download-btn"
            style={download_btn_style}
            onClick={() => onShare(card)}
          >
            <img
              className="card__download-icon"
              src={share_icon}
              alt="download"
            />
          </div>
        </div>
        <div className="card__bottom-box">
          <div className="card__body">
            <div className="pie__wrapper" onClick={onPieOpen}>
              <PieChart
                className="card-pie"
                data={card.pieData}
                startAngle={-90}
                labelPosition={87}
                radius={40}
              />
            </div>
            <div className="card__body-top">
              <h3 className="card__title">{card.name}</h3>
              <div className="group1">
                {showAddress()}
                {showType()}
              </div>
            </div>
            <div className="card__body-bottom">
              {showButton()}
              <h3 className="card__text nft-price">{card.price} AVAX</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Card);
